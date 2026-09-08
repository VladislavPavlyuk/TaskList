import {useEffect, useState} from 'react';
import {createTask, getTasks, updateTask} from '../api/tasksApi.ts'
import {Task} from '../types/Task.ts';
import TaskItem from "../components/TaskItem.tsx";
import {Alert} from "react-native";
import {useAuth} from "../context/AuthContext.tsx";

const TaskScreen = () => {
    const [tasks,setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const {accessToken, logout} = useAuth();

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasks(accessToken);
            setTasks(data);
        } catch (error) {
            Alert.alert('Error','Task upload failed.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
};

useEffect(()) => {
    //TODO move loadTasks here
    loadTasks();
});

const handleAddTask = async (task: Task) => {
    if (!title.trim()){
        return;
    }
    try {
        const task = await createTask(accessToken, title, description);
        setTasks(prev =>[...prev, task]);
        setTitle('');
        setDescription('');
    } catch (error) {
        
    }
}
return (
    <View style={styles.container}>
        <Text style={styles.header}>Tasl List</Text>
          < style={styles.addContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={'New task'}
            />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder={'Description'}
            />
              {/*<Pressable
                style={styles.addButton}
                onPress={handleAddTask}>
              <Text style={styles.addText}>Add Task</Text>
            </Pressable>*/}
          />
              <FlatList
                  data={tasks}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                      <TaskItem task={item} onToggle={()=>{handleToggle(item)}} onDelete={()=>{}}/>
                  )}
                  ListEmptyComponent = {
                        <Text style={styles.empty}>Task list is empty</Text>
                    }
                  />
              <Pressable style={styles.fab} onPress={handleAddTask}>
                  <Text style={styles.fabText}>💾</Text>
              </Pressable>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,

    },
    center:{
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    header:{

    },
    addContainer:{
        flexDirection:'row',

    },
    input:{
        flex: 1,
        backgroundColor:'#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    addButton:{
        backgroundColor:'#007AFF',
        justifyContent:'center',
        paddingHorizontal: 16,
        marginLeft: 8,
        borderRadius: 8,
    },
    addText:{
        color:'#fff',
        fontWeight:'bold',
    },
    empty:{
        textAlign:'center',
        marginTop: 50,
        color:'#777',
        fontSize: 16,
    },
    fab: {
        position:'absolute',
        right: 5,
        bottom: 5,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        zIndex: 10,
    },
    fabText:{
        fontSize: 32,
        lineHeight: 34,
    }
});


export default TaskScreen;