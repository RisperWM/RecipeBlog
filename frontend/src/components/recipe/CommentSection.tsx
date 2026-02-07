import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration, Platform } from 'react-native';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId?: {
    _id: string;
    firstName: string;
    surname: string;
  };
}

interface CommentSectionProps {
  comments: Comment[];
  currentUserId?: string;
  onCommentLongPress: (comment: Comment) => void;
}

const CommentSection = ({
  comments = [],
  currentUserId,
  onCommentLongPress
}: CommentSectionProps) => {

  const handleLongPress = (comment: Comment) => {
    if (comment.userId?._id === currentUserId) {
      if (Platform.OS !== 'web') Vibration.vibrate(10);
      onCommentLongPress(comment);
    }
  };

  return (
    <View style={styles.commentSection}>
      <Text style={styles.sectionTitle}>
        Comments <Text style={styles.countText}>({comments.length})</Text>
      </Text>

      {comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet. Be the first to share your thoughts!</Text>
        </View>
      ) : (
        comments.map((comment) => {
          const isMe = comment.userId?._id === currentUserId;

          return (
            <TouchableOpacity
              key={comment._id}
              onLongPress={() => handleLongPress(comment)}
              delayLongPress={300}
              activeOpacity={0.7}
              style={[
                styles.commentBubble,
                isMe && styles.myCommentBubble
              ]}
            >
              <View style={styles.commentHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.commentUser}>
                    {comment.userId?.firstName ?? 'Anonymous'} {comment.userId?.surname ?? ''}
                  </Text>
                  {isMe && (
                    <View style={styles.meBadge}>
                      <Text style={styles.meBadgeText}>You</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.commentDate}>
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </TouchableOpacity>
          );
        })
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
  countText: {
    color: "#94a3b8",
    fontWeight: "500",
  },
  commentBubble: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  myCommentBubble: {
    backgroundColor: "#fff",
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 6,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meBadge: {
    backgroundColor: '#f9731615',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  meBadgeText: {
    fontSize: 10,
    color: '#f97316',
    fontWeight: '700',
    textTransform: 'uppercase',
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
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});