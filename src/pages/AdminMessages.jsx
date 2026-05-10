import React, { useCallback, useEffect, useState } from 'react';
import { Mail, RefreshCcw, Reply } from 'lucide-react';
import MinimalSidebar from '../components/MinimalSidebar';
import { adminAPI } from '../services/api';

const AdminMessages = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyStatus, setReplyStatus] = useState({ type: '', text: '' });

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getMessages();
      if (res?.success) {
        setMessages(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res?.message || 'Failed to load messages');
      }
    } catch (e) {
      setError(e?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const openReply = (msg) => {
    setReplyStatus({ type: '', text: '' });
    setReplyOpenId(msg?._id || null);
    setReplyText('');
    setReplySubject(`Re: ${msg?.subject || 'Your message to OwnSpace'}`);
  };

  const sendReply = async () => {
    if (!replyOpenId) return;
    setReplySending(true);
    setReplyStatus({ type: '', text: '' });
    try {
      const res = await adminAPI.replyToMessage(replyOpenId, {
        subject: replySubject,
        replyText
      });
      if (res?.success) {
        setReplyStatus({ type: 'success', text: 'Reply sent successfully.' });
        setReplyText('');
      } else {
        setReplyStatus({ type: 'error', text: res?.message || 'Failed to send reply.' });
      }
    } catch (e) {
      setReplyStatus({ type: 'error', text: e?.message || 'Failed to send reply.' });
    } finally {
      setReplySending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <MinimalSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:block">
        <MinimalSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <span className="sr-only">Open sidebar</span>
                <div className="w-5 h-5 grid place-items-center">
                  <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
                  <div className="w-5 h-0.5 bg-gray-700 mb-1.5" />
                  <div className="w-5 h-0.5 bg-gray-700" />
                </div>
              </button>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              </div>
            </div>

            <button
              onClick={loadMessages}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {loading ? (
                <p className="text-sm text-gray-600">Loading messages...</p>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <p className="text-sm text-gray-600">No messages received yet.</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={msg._id || idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{msg.subject}</p>
                          <p className="text-xs text-gray-500">
                            From {msg.name} ({msg.userType}) - {msg.email}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Unknown time'}
                        </p>
                      </div>
                      {msg.phone && <p className="text-xs text-gray-600 mt-2">Phone: {msg.phone}</p>}
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{msg.message}</p>

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <button
                          onClick={() => openReply(msg)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 w-fit"
                        >
                          <Reply className="h-4 w-4" />
                          Reply
                        </button>
                      </div>

                      {replyOpenId === (msg._id || null) && (
                        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                          {replyStatus.text && (
                            <div className={`rounded-md p-3 text-sm ${replyStatus.type === 'success'
                              ? 'bg-green-50 border border-green-200 text-green-800'
                              : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                              {replyStatus.text}
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                            <input
                              value={replySubject}
                              onChange={(e) => setReplySubject(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Email subject"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Reply</label>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Type your reply..."
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={sendReply}
                              disabled={replySending || !replyText.trim()}
                              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            >
                              {replySending ? 'Sending...' : 'Send Reply'}
                            </button>
                            <button
                              onClick={() => setReplyOpenId(null)}
                              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMessages;

