from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from jira import JIRA
from pydantic import BaseModel
import os
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Jira API wrapper", description="API to interact with Jira using python-jira")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JIRA_SERVER = os.getenv("JIRA_SERVER", "https://your-domain.atlassian.net")
JIRA_EMAIL = os.getenv("JIRA_EMAIL", "email@example.com")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN", "your_api_token")

def get_jira_client():
    if not JIRA_SERVER or not JIRA_EMAIL or not JIRA_API_TOKEN:
        raise HTTPException(status_code=500, detail="Jira credentials not fully configured.")
    try:
        jira = JIRA(server=JIRA_SERVER, basic_auth=(JIRA_EMAIL, JIRA_API_TOKEN))
        return jira
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to Jira: {str(e)}")

class IssueCreate(BaseModel):
    project_key: str
    summary: str
    description: str
    issue_type: str = "Task"

class IssueResponse(BaseModel):
    key: str
    summary: str
    status: str
    description: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Jira Integration"}

@app.get("/api/issues/{project_key}", response_model=List[IssueResponse])
def get_issues(project_key: str, client: JIRA = Depends(get_jira_client)):
    try:
        # Search for issues in the given project
        issues = client.search_issues(f'project={project_key} ORDER BY created DESC', maxResults=50)
        result = []
        for issue in issues:
            result.append(IssueResponse(
                key=issue.key,
                summary=issue.fields.summary,
                status=str(issue.fields.status),
                description=getattr(issue.fields, "description", "")
            ))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/issues", response_model=IssueResponse)
def create_issue(issue_data: IssueCreate, client: JIRA = Depends(get_jira_client)):
    try:
        issue_dict = {
            'project': {'key': issue_data.project_key},
            'summary': issue_data.summary,
            'description': issue_data.description,
            'issuetype': {'name': issue_data.issue_type},
        }
        new_issue = client.create_issue(fields=issue_dict)
        return IssueResponse(
            key=new_issue.key,
            summary=new_issue.fields.summary,
            status=str(new_issue.fields.status),
            description=new_issue.fields.description
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
