import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Progress,
  Box,
  Button,
  Heading,
  Pressable,
  Input,
  Modal,
  Icon,
  FormControl,
  CheckBox,
} from "native-base";
import { ImageBackground, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import banner from "../assets/banner.jpg";

function Today() {
  // Figure out where we pull date or refetch date
  const [date, setDate] = useState(new Date().toDateString());
  // Need alg to read and determine (completed tasks) / (total tasks)
  const [progress, setProgress] = useState(0);
  const [newTask, openNewTask] = useState(false);
  const [tasks, setTasks] = useState([
    {
      title: "Task Title",
      description: "Task Description",
      startTime: "8:20 AM",
      endTime: "10:00 AM",
    },
  ]);

  // get req to backend to grab tasks for that day (Post req?) or shape what we need in initial gql req
  //   useEffect(() => {
  //     fetch("/endpoint")
  //       .then((res) => res.json())
  //       .then((data) => setTasks(data))
  //       .catch((err) => console.log(err));
  //   }, [date]);

  const addTask = (taskTitle, taskDescription, startTime, endTime) => {
    let newTask = {
      title: taskTitle,
      description: taskDescription,
      startTime: startTime,
      endTime: endTime,
    };
    console.log("Checking task props: ", newTask);
    setTasks((task) => [...task, newTask]);
    openNewTask(false);
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        style={styles.topContainer}
        // source={banner}
        resizeMode="cover"
      >
        <View>
          <Text style={styles.topContainerText}>Today:</Text>
          <Text>{date}</Text>
        </View>
        <Box w="50%" p="3" _text={{ textAlign: "center" }}>
          <Progress size="lg" value={progress} />
          <Text> Daily Progress: {progress}%</Text>
        </Box>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <Heading>Tasks:</Heading>
        <Box style={styles.box}>
          {tasks.map((task) => (
            <Task
              description={task.description}
              title={task.title}
              startTime={task.startTime}
              completed={task.completed}
              endTime={task.endTime}
            />
          ))}
          <Pressable
            onPress={() => openNewTask(true)}
            style={styles.taskContainer}
          >
            <Text>Create a new task..</Text>
          </Pressable>
          {newTask ? (
            <NewTaskModal
              setTasks={setTasks}
              addTask={addTask}
              newTask={newTask}
              openNewTask={openNewTask}
            />
          ) : (
            ""
          )}
        </Box>
      </View>
      {/* <Button onPress={() => addTask()} style={styles.btn}>
        +
      </Button> */}
    </View>
  );
}

const Task = ({ title, description, startTime, endTime, completed }) => {
  const [openTask, toggleOpenTask] = useState(false);

  //Don't delete this
  // let displayStartTime = startTime.split(',')[1].trim();
  // let displayEndTime = endTime.split(',')[1].trim();

  return (
    <Pressable onPress={() => toggleOpenTask(true)}>
      <View style={styles.taskContainer} key={title}>
        <Heading style={styles.taskHeading}>{title}</Heading>
        <View style={styles.taskContainerTimeContainer}>
          <Text>{startTime}</Text>
          <Text>to</Text>
          <Text>{endTime}</Text>
        </View>
        <Modal isOpen={openTask} onClose={() => toggleOpenTask(false)}>
          <Modal.CloseButton />
          <Modal.Content
            width="95%"
            height="400"
            display="flex"
            flexDirection="column"
            borderColor="grey"
            borderWidth={2}
            alignItems="center"
            safeAreaTop={true}
          >
            <View style={styles.taskContainerTimeContainer}>
              <Heading style={styles.taskHeading}>{title}</Heading>
              <Text>{startTime}</Text>
              <Text>to</Text>
              <Text>{endTime}</Text>
              <View style={styles.modalTaskDescriptionContainer}>
                <Text>{description}</Text>
              </View>
            </View>
          </Modal.Content>
        </Modal>
        {/* <CheckBox value="test" /> */}
      </View>
    </Pressable>
  );
};

const NewTaskModal = ({ newTask, openNewTask, setTasks, addTask }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startTime, updateStartTime] = useState("");
  const [endTime, updateEndTime] = useState("");
  const [taskTitle, updateTaskTitle] = useState("");
  const [taskDescription, updateTaskDescription] = useState("");

  // const addTask = () => {
  //   let newTask = {
  //     title: taskTitle,
  //     description: taskDescription,
  //     startTime: startTime,
  //     endTime: endTime,
  //   };
  //   setTasks((task) => [...task, newTask]);
  //   openNewTask(false);
  // };
  return (
    <Modal isOpen={newTask} onClose={() => openNewTask(false)} size="lg">
      <Modal.Content
        maxWidth="400"
        height="400"
        display="flex"
        flexDirection="column"
        alignItems="center"
        safeAreaTop={true}
      >
        <Modal.CloseButton />
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Task Title:</FormControl.Label>
            <Input
              value={taskTitle}
              onChangeText={(text) => updateTaskTitle(text)}
              placeholder="Title"
              minWidth={"100%"}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Task Description:</FormControl.Label>
            <Input
              value={taskDescription}
              onChangeText={(text) => updateTaskDescription(text)}
              placeholder="Description"
              minWidth={"100%"}
            />
          </FormControl>
          <StartTimeInput
            startTime={startTime}
            updateStartTime={updateStartTime}
          />
          <EndTimeInput endTime={endTime} updateEndTime={updateEndTime} />
          <Button
            onPress={() =>
              addTask(taskTitle, taskDescription, startTime, endTime)
            }
            marginTop={5}
          >
            <Text>Add Task</Text>
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

const StartTimeInput = ({ startTime, updateStartTime }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetStartTime = (date) => {
    updateStartTime(
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    setDatePickerVisibility(false);
  };

  return (
    <FormControl>
      <FormControl.Label>Start Time:</FormControl.Label>
      <Pressable>
        <Input
          isReadOnly
          value={startTime}
          // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
          minWidth={"100%"}
          InputRightElement={
            <Button onPress={() => setDatePickerVisibility(true)} size="sm">
              Pick Time
            </Button>
          }
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleSetStartTime}
        onCancel={() => setDatePickerVisibility(false)}
        is24Hour={false}
      />
    </FormControl>
  );
};

const EndTimeInput = ({ endTime, updateEndTime }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleSetEndTime = (date) => {
    updateEndTime(
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
    setDatePickerVisibility(false);
  };

  return (
    <FormControl>
      <FormControl.Label>End Time:</FormControl.Label>
      <Pressable>
        <Input
          isReadOnly
          value={endTime}
          // onChange={(e) => setStartTime(e.target.value.toLocaleString())}
          minWidth={"100%"}
          InputRightElement={
            <Button onPress={() => setDatePickerVisibility(true)} size="sm">
              Pick Time
            </Button>
          }
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleSetEndTime}
        onCancel={() => setDatePickerVisibility(false)}
        is24Hour={false}
      />
    </FormControl>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    // flexDirection: "row",
    // textAlign: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    // borderColor: "green",
    // borderWidth: 3,
    // maxWidth: "100%",
    zIndex: -1,
  },
  topContainer: {
    // bottom: 700,
    // left: -214,
    position: "relative",
    top: 120,
    width: "100%",
    borderBottomColor: "black",
    borderWidth: 2,
    maxHeight: 120,
    paddingHorizontal: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "red",
    alignItems: "center",
  },
  topContainerText: {
    fontSize: 30,
    paddingVertical: 18,
    // color: "white",
  },
  bottomContainer: {
    // borderColor: "cyan",
    // borderWidth: 3,
    position: "relative",
    top: 120,
    // bottom: 600,
    // left: -214,
    // height: 100,
    width: "100%",
  },
  btn: {
    position: "absolute",
    bottom: 100,
    right: "50%",
  },
  box: {
    // height: 400,
    position: "relative",
    // bottom: 100,
    // bottom: 600,
    display: "flex",
    flexDirection: "column",
  },
  taskContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    height: 70,
    margin: 10,
    borderRadius: 10,
  },
  taskContainerTimeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  taskHeading: {
    fontSize: 18,
  },
  modalTaskDescriptionContainer: {
    borderColor: "grey",
    borderWidth: 5,
    minWidth: "100%",
    height: "75%",
  },
});

export default Today;
