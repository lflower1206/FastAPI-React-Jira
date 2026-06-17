import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Plus, Search, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface Issue {
  key: string;
  summary: string;
  status: string;
  description: string;
}

function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [projectKey, setProjectKey] = useState('PROJ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [newIssue, setNewIssue] = useState({
    summary: '',
    description: '',
    issue_type: 'Task'
  });
  const [creating, setCreating] = useState(false);

  const fetchIssues = async () => {
    if (!projectKey) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/issues/${projectKey}`);
      setIssues(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.summary || !projectKey) return;
    
    setCreating(true);
    setError(null);
    try {
      await axios.post(`${API_BASE_URL}/issues`, {
        project_key: projectKey,
        ...newIssue
      });
      setNewIssue({ ...newIssue, summary: '', description: '' });
      fetchIssues(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create issue');
    } finally {
      setCreating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('done') || s.includes('resolved') || s.includes('closed')) {
      return <CheckCircle2 className="text-emerald-400" size={18} />;
    }
    if (s.includes('progress') || s.includes('review')) {
      return <Clock className="text-amber-400" size={18} />;
    }
    return <Circle className="text-blue-400" size={18} />;
  };

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('done') || s.includes('resolved') || s.includes('closed')) return 'done';
    if (s.includes('progress') || s.includes('review')) return 'inprogress';
    return 'todo';
  };

  return (
    <div className="container">
      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="header-title">Jira Dashboard</h1>
        <p className="header-subtitle">Manage your project issues with elegance</p>
      </motion.header>

      {error && (
        <motion.div 
          className="glass-card mb-6 flex items-center gap-3 text-red-400"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid-layout">
        {/* Create Issue Section */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-400" />
            Create Issue
          </h2>
          <form onSubmit={handleCreateIssue}>
            <div className="form-group">
              <label className="form-label">Project Key</label>
              <input 
                type="text" 
                className="input-field" 
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                placeholder="e.g. PROJ"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Summary</label>
              <input 
                type="text" 
                className="input-field" 
                value={newIssue.summary}
                onChange={(e) => setNewIssue({...newIssue, summary: e.target.value})}
                placeholder="Issue summary..."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="input-field" 
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                placeholder="Detailed description..."
                rows={4}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={creating}
            >
              {creating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              {creating ? 'Creating...' : 'Create Issue'}
            </button>
          </form>
        </motion.div>

        {/* Issues List Section */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Search size={20} className="text-emerald-400" />
              Recent Issues
            </h2>
            <button 
              onClick={fetchIssues}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex-center">
              <div className="loading-spinner"></div>
            </div>
          ) : issues.length === 0 ? (
            <div className="flex-center text-secondary flex-col gap-3">
              <Search size={32} style={{ opacity: 0.5 }} />
              <p>No issues found for project {projectKey}</p>
            </div>
          ) : (
            <div className="issue-list">
              {issues.map((issue, index) => (
                <motion.div 
                  key={issue.key}
                  className="issue-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="issue-main">
                    <span className="issue-key">{issue.key}</span>
                    <h3 className="issue-summary">{issue.summary}</h3>
                    {issue.description && (
                      <p className="text-sm text-secondary line-clamp-2 mt-1 mb-2 opacity-80">
                        {issue.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`issue-status ${getStatusClass(issue.status)}`}>
                      {issue.status}
                    </span>
                    {getStatusIcon(issue.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;
