import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDiscussionForum = () => {
  const [threads, setThreads] = useState([]);
  const [replies, setReplies] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditThreadModal, setShowEditThreadModal] = useState(false);
  const [showEditReplyModal, setShowEditReplyModal] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [role, navigate]);

  useEffect(() => {
    if (role === 'admin') {
      fetchThreads();
      fetchReplies();
    }
  }, [role]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/threads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setThreads(response.data);
    } catch (err) {
      // setError('Error fetching threads');
      toast.error('Error fetching threads');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/replies', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReplies(response.data);
    } catch (err) {
      // setError('Error fetching replies');
      toast.error('Error fetching replies');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThread = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/threads/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      await fetchThreads();
      await fetchReplies();

      // setSuccess('Thread and its replies deleted successfully');
      toast.success('Thread and its replies deleted successfully');
      setError('');
    } catch (err) {
      // setError('Error deleting thread');
      toast.error('Error deleting thread');
      setSuccess('');
    }
  };

  const handleEditThread = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/threads/${selectedThread._id}`,
        selectedThread,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      await fetchThreads();

      // setSuccess('Thread updated successfully');
      toast.success('Thread updated successfully');
      setError('');
      setShowEditThreadModal(false);
    } catch (err) {
      // setError('Error updating thread');
      toast.error('Error updating thread');
      setSuccess('');
    }
  };

  const handleEditReply = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/replies/${selectedReply._id}`,
        selectedReply,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      await fetchReplies();

      // setSuccess('Reply updated successfully');
      toast.success('Reply updated successfully');
      setError('');
      setShowEditReplyModal(false);
    } catch (err) {
      // setError('Error updating reply');
      toast.error('Error updating reply');
      setSuccess('');
    }
  };

  const handleDeleteReply = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/replies/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      await fetchReplies();

      // setSuccess('Reply deleted successfully');
      toast.success('Reply deleted successfully');
      setError('');
    } catch (err) {
      // setError('Error deleting reply');
      toast.error('Error deleting reply');
      setSuccess('');
    }
  };

  if (role !== 'admin') {
    return (
      <Container className="mt-4">
        <h2>Access Denied</h2>
        <Alert variant="danger">You do not have permission to access this page.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ padding: '20px',marginBottom:"80px" }}>
      <h2 className="text-center mb-4">Admin Discussion Forum</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <h3>Threads</h3>
          <Table responsive striped bordered hover className="mb-4">
            <thead className="bg-dark text-white">
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {threads.map((thread) => (
                <tr key={thread._id}>
                  <td style={{ wordWrap: 'break-word', maxWidth: '200px' }}>{thread.title}</td>
                  <td style={{ wordWrap: 'break-word', maxWidth: '400px' }}>{thread.content}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelectedThread(thread);
                        setShowEditThreadModal(true);
                      }}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteThread(thread._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3>Replies</h3>
          <Table responsive striped bordered hover className="mb-4" >
            <thead className="bg-dark text-white">
              <tr>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {replies.map((reply) => (
                <tr key={reply._id}>
                  <td style={{ wordWrap: 'break-word', maxWidth: '400px' }}>{reply.content}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelectedReply(reply);
                        setShowEditReplyModal(true);
                      }}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteReply(reply._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {/* Edit Thread Modal */}
      <Modal show={showEditThreadModal} onHide={() => setShowEditThreadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={selectedThread?.title || ''}
                onChange={(e) => setSelectedThread({ ...selectedThread, title: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedThread?.content || ''}
                onChange={(e) => setSelectedThread({ ...selectedThread, content: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditThreadModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditThread}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Reply Modal */}
      <Modal show={showEditReplyModal} onHide={() => setShowEditReplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Reply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedReply?.content || ''}
                onChange={(e) => setSelectedReply({ ...selectedReply, content: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditReplyModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditReply}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default AdminDiscussionForum;