import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createTask, deleteTask, getTasks, updateTask} from '../api/tasksApi';
import {EditTaskModal} from '../components/EditTaskModal';
import TaskItem from '../components/TaskItem';
import {useAuth} from '../context/AuthContext';
import {Task} from '../types/Task';

const TasksScreen = () => {
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Task | null>(null);
  const {logout} = useAuth();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Task upload failed.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const handleAddTask = async () => {
    if (!title.trim()) {
      return;
    }
    try {
      const task = await createTask(title.trim(), description.trim());
      setTasks(prev => [task, ...prev]);
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Create failed',
      );
    }
  };

  const handleToggle = async (task: Task) => {
    const next = {...task, completed: !task.completed};
    setTasks(prev => prev.map(item => (item.id === task.id ? next : item)));
    try {
      const updated = await updateTask(task.id, {completed: next.completed});
      setTasks(prev =>
        prev.map(item => (item.id === task.id ? updated : item)),
      );
    } catch (error) {
      setTasks(prev => prev.map(item => (item.id === task.id ? task : item)));
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Update failed',
      );
    }
  };

  const handleEditSave = async (nextTitle: string, nextDescription: string) => {
    if (!editing) {
      return;
    }
    const current = editing;
    try {
      const updated = await updateTask(current.id, {
        title: nextTitle,
        description: nextDescription,
      });
      setTasks(prev =>
        prev.map(item => (item.id === current.id ? updated : item)),
      );
      setEditing(null);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Update failed',
      );
    }
  };

  const handleDelete = async (task: Task) => {
    const snapshot = tasks;
    setTasks(prev => prev.filter(item => item.id !== task.id));
    try {
      await deleteTask(task.id);
    } catch (error) {
      setTasks(snapshot);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Delete failed',
      );
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Task List</Text>
        <Pressable onPress={() => void logout()}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="New task"
        />
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{paddingBottom: insets.bottom + 88}}
          renderItem={({item}) => (
            <TaskItem
              task={item}
              onToggle={() => handleToggle(item)}
              onEdit={() => setEditing(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>Task list is empty</Text>
          }
        />
      )}
      <Pressable
        style={[styles.fab, {bottom: insets.bottom + 16}]}
        onPress={() => void handleAddTask()}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
      <EditTaskModal
        task={editing}
        onClose={() => setEditing(null)}
        onSave={handleEditSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
  },
  logout: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  addContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    fontSize: 32,
    lineHeight: 34,
    color: '#fff',
    fontWeight: '600',
  },
});

export default TasksScreen;
