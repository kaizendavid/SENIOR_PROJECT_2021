


export default (userState, action) => {

    switch(action.type) {
 
        case 'USER_DATA':
            return {
                ...userState,
                //changing names, etc
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                role: action.payload.role
            }

        case 'LOGIN_STATUS':
            return{
                ...userState,
                loggedIn: action.payload
            }

        case 'LAST_LESSON':
            return {
                ...userState,
                //changing the last lesson
                lastLesson: { module: action.payload.module, lessonId: action.payload.lessonId } 
            }

        case 'MODULES_COMPLETED':
            return {
                ...userState,
                //adding the modules completed
                modulesCompleted: action.payload
            }

        case 'ADD_LESSON_ID': {
            let index = action.payload.currentModule;
            //zero based array
            index--;
            //making a new array
            const updatedModulesCompletedLessonIds = [...userState.modulesCompleted];
            //find module
            updatedModulesCompletedLessonIds[index].lessonIds.push(action.payload.currentStepPosition);
            console.log("2 ADD_LESSON_ID****** updatedModulesCompletedLessons: " + JSON.stringify(updatedModulesCompletedLessonIds));
            return { 
                ...userState,
                modulesCompleted: updatedModulesCompletedLessonIds,
            }
        }

        case 'MODULE_FINISHED':{
            let modIndex = action.payload.currentModule;
            //zero index based array
            modIndex--;
            //making a new array
            const updatedModulesCompletedFinished = [...userState.modulesCompleted];
            //find module based on index and change the moduleFinish key-value pair
            updatedModulesCompletedFinished[modIndex].moduleFinish = action.payload.finished;
            console.log("2)updatedModulesCompletedFinished: " + JSON.stringify(updatedModulesCompletedFinished));
            return { 
                ...userState,
                modulesCompleted: updatedModulesCompletedFinished
            }
        }

        case 'ADD_NEW_MODULE':{
            //making a new array and adding the newModule to the end
            const newModulesCompleted = [...userState.modulesCompleted, 
                {   module: action.payload.module,
                    lessonIds: action.payload.lessonIds,
                    moduleFinish: action.payload.moduleFinish }];

            console.log("5) newModulesCompleted: " + JSON.stringify(newModulesCompleted));
            return {
                ...userState,
                //reassigning the modulesCompleted with the new one
                modulesCompleted: newModulesCompleted
            }

        }


        case 'LOGIN_USER':
            return {
                ...userState,
                loggedIn: true,
                email: action.payload.email,
                role: action.payload.role
            }

        case 'LOGOFF_USER':
            return {
                ...userState,
                loggedIn: false,
                email: ""
            }


        default:
            return userState;
    }

}