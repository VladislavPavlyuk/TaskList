import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Task} from '../types/Task';

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem = ({task, onToggle, onEdit, onDelete}: Props) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.checkbox, task.completed && styles.checkboxOn]}
        onPress={onToggle}
        hitSlop={8}>
        <Text style={styles.checkMark}>{task.completed ? '✓' : ''}</Text>
      </Pressable>
      <Pressable style={styles.task} onPress={onEdit}>
        <Text
          style={[styles.title, task.completed && styles.completed]}
          numberOfLines={2}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
      </Pressable>
      <Pressable onPress={onDelete} hitSlop={8}>
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  task: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: '#007AFF',
  },
  checkMark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  description: {
    marginTop: 2,
    color: '#666',
    fontSize: 13,
  },
  deleteText: {
    fontSize: 18,
    color: '#c00',
    paddingHorizontal: 8,
  },
});

export default TaskItem;
