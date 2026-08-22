import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Button, Input, Modal, Tag, Space, Divider, Form } from 'antd';
import { LikeOutlined, LikeFilled, CommentOutlined, ShareAltOutlined, PlusOutlined, FireOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { addPost, likePost, addComment } from '../../store/slices/communitySlice';

export default function CommunityPage() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.community);
  const { user } = useSelector((state) => state.auth);

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const handleCreatePost = () => {
    if (!postContent) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        name: user?.name || 'Farmer Member',
        role: `${user?.role || 'Farmer'} • ${user?.location || 'India'}`,
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      timestamp: 'Just now',
      content: postContent,
      image: postImage || null,
      likes: 0,
      commentsCount: 0,
      comments: []
    };
    dispatch(addPost(newPost));
    setPostContent('');
    setPostImage('');
    setCreatePostOpen(false);
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!text) return;
    dispatch(addComment({
      postId,
      comment: {
        id: `c-${Date.now()}`,
        user: user?.name || user?.username || 'You',
        text,
        time: 'Just now'
      }
    }));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        borderRadius: 20,
        padding: '32px',
        color: 'white',
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: 0 }} className="brand-font">
            UPKARAN Krishi Community Forum
          </h1>
          <p style={{ color: '#e8f5e9', fontSize: 16, margin: '4px 0 0 0' }}>
            Connect with agricultural scientists, progressive farmers, and machine experts across India
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setCreatePostOpen(true)}
          style={{ background: '#FFC107', color: '#0f172a', fontWeight: 800, border: 'none', height: 48 }}
        >
          Create Post
        </Button>
      </div>

      <Row gutter={[32, 32]}>
        {/* Main Feed */}
        <Col xs={24} lg={16}>
          {/* Create Post Prompt */}
          <Card style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Avatar src={user?.avatar} size={48} />
              <Input
                placeholder="Share tractor advice, crop tips, or equipment reviews with community..."
                onClick={() => setCreatePostOpen(true)}
                size="large"
                style={{ borderRadius: 20, cursor: 'pointer' }}
                readOnly
              />
            </div>
          </Card>

          {/* Posts List */}
          {posts.map((post) => (
            <Card key={post.id} style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
              {/* Author Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <Avatar src={post.author.avatar} size={48} />
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0 }}>{post.author.name}</h4>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{post.author.role} • {post.timestamp}</div>
                </div>
              </div>

              {/* Content */}
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#334155', marginBottom: 16 }}>{post.content}</p>

              {/* Image if present */}
              {post.image && (
                <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16, maxHeight: 380 }}>
                  <img src={post.image} alt="post media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Actions: Like, Comment, Share */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                <Button type="text" icon={<LikeOutlined />} onClick={() => dispatch(likePost(post.id))}>
                  {post.likes} Likes
                </Button>
                <Button type="text" icon={<CommentOutlined />}>
                  {post.commentsCount} Comments
                </Button>
                <Button type="text" icon={<ShareAltOutlined />}>
                  Share
                </Button>
              </div>

              {/* Comments list */}
              {post.comments.length > 0 && (
                <div style={{ marginTop: 16, background: '#f8fafc', padding: 14, borderRadius: 12 }}>
                  {post.comments.map((c) => (
                    <div key={c.id} style={{ marginBottom: 10 }}>
                      <strong style={{ color: '#0f172a', fontSize: 13 }}>{c.user}:</strong>{' '}
                      <span style={{ fontSize: 13, color: '#475569' }}>{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Input
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onPressEnter={() => handleAddComment(post.id)}
                />
                <Button type="primary" style={{ background: '#2E7D32' }} onClick={() => handleAddComment(post.id)}>
                  Post
                </Button>
              </div>
            </Card>
          ))}
        </Col>

        {/* Sidebar Trending */}
        <Col xs={24} lg={8}>
          <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FireOutlined style={{ color: '#e11d48' }} /> Trending Agri Discussions</span>} style={{ borderRadius: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <Tag color="green">#TractorMonsoonTips</Tag>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>How to clean oil-immersed brake filters</div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>142 Farmers Discussing</span>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Tag color="gold">#DroneSprayingGovtSubsidy</Tag>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>SMAM Scheme 50% subsidy application open</div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>98 Farmers Discussing</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal: Create Post */}
      <Modal
        title="Create Krishi Community Post"
        open={createPostOpen}
        onCancel={() => setCreatePostOpen(false)}
        onOk={handleCreatePost}
        okText="Publish Post"
        okButtonProps={{ style: { background: '#2E7D32' } }}
      >
        <Input.TextArea
          rows={4}
          placeholder="What's on your mind regarding crop harvesting or farm machinery?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Image URL (Optional)"
          value={postImage}
          onChange={(e) => setPostImage(e.target.value)}
        />
      </Modal>
    </div>
  );
}
