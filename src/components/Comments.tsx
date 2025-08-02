import React, { useState } from 'react';
import { useComments } from '../hooks/useComments';
import { TrashIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../utils/helpers';

interface CommentsProps {
  characterId: string;
}

const Comments: React.FC<CommentsProps> = ({ characterId }) => {
  const { comments, addComment, removeComment } = useComments(characterId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim(), characterId);
      setNewComment('');
    }
  };

  const handleDelete = (commentId: string) => {
    removeComment(commentId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          rows={3}
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  title="Delete comment"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments; 