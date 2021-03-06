import {tasksReducer} from "../reducers/tasksReducer";
import {daysReducer} from "../reducers/daysReducer";
import {combineReducers, compose, createStore} from "redux";
import throttle from "lodash.throttle"; // yarn add lodash.throttle //yarn add @types/lodash.throttle


// для работы с REDUX_DEVTOOLS: Window c Большой Буквы Window
declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;






//https://medium.com/@jrcreencia/persisting-redux-state-to-local-storage-f81eb0b90e7e
//https://www.youtube.com/watch?v=U8f01SM8Kq4
const loadState = () => {
	try {
		const serializedState = localStorage.getItem('app-state')
		if (serializedState === null) {
			return undefined
		}
		return JSON.parse(serializedState)
	} catch (err) {
		return undefined
	}
}

const saveState = (state: AppRootState) => {
	try {
		const serializedState = JSON.stringify(state)
		localStorage.setItem('app-state', serializedState)
	} catch {
		// ignore write errors
	}
}

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния


const rootReducer = combineReducers({
	tasks: tasksReducer,
	days: daysReducer
})

// определить автоматически тип всего объекта состояния
export type AppRootState = ReturnType<typeof rootReducer>

// непосредственно создаём store по рекомендации Dan Abramov:
export const store = createStore(rootReducer, loadState(), composeEnhancers())

//Дроссель throttle: вызывает функцию не чаще одного раза в 1000 миллисекунд.
store.subscribe(
	throttle(() => {
		saveState({
			tasks: store.getState().tasks,
			days: store.getState().days
		})
	}, 1000)
)



// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
//@ts-ignore

//window.store=store
