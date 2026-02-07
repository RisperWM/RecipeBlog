import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId?: {
    firstName: string;
    surname: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
}


const CommentSection = ({ comments = [] }: CommentSectionProps) => {
  return (
    <View style={styles.commentSection}>
      <Text style={styles.sectionTitle}>
        Comments ({comments.length})
      </Text>

      {comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet. Be the first to share your thoughts!</Text>
        </View>
      ) : (
        comments.map((comment) => (
          <View key={comment._id} style={styles.commentBubble}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>
                {comment.userId?.firstName ?? 'Anonymous'} {comment.userId?.surname ?? ''}
              </Text>
              <Text style={styles.commentDate}>
                {new Date(comment.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))
      )}
    </View>
  );
};

export default CommentSection;

const styles = StyleSheet.create({
  commentSection: {
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
    paddingTop: 25,
    paddingBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 15,
  },
  commentBubble: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 6,
  },
  commentUser: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1e293b",
  },
  commentDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
  commentText: {
    color: "#475569",
    lineHeight: 20,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});