import { Pressable, StyleSheet,  Text, View } from 'react-native';
import { Task } from '../types/Task.ts';

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: ({ task, onToggle  }: { task: any; onToggle: any }) => void = (
  {task, onToggle, onDelete }:Props) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.task}
        onPress={onToggle}
        >
        <Text>
          {task.completed ? '+' : '-'}
        </Text>
        <Text
          style={[
            styles.title,
            task.completed && styles.complited
            ]}>
          {task.title}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  task:{
    flex:1,
    flexDirection:'row',
    alignItems: 'center',
  },
  checkBox:{
    marginRight:12,
  },
  title: {

  },
  complited:{
    textDecorationLine: 'line-through',
  },
  deleteText:{

  }
})
export default TaskItem;
