import {
    FlatList,
    Pressable,
  StyleSheet,
  Task,
  Text,
  TextInput,
  View,
} from 'react-native';
import TaskItem from "../components/TaskItem.tsx";

const TaskScreen = ({task}: {task: Task}) => {

};

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