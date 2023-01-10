import React, { useReducer } from "react";

export function leaveEnabled(state, floor) {
  if (floor === undefined) {
    return state.totalAvailable < state.totalSpaces;
  } else {
    return state.floors[floor].available < state.floors[floor].spaces;
  }
}

export function parkEnabled(state, floor) {
  if (floor === undefined) {
    return state.totalAvailable > 0;
  } else {
    return state.floors[floor].available > 0;
  }
}

export function findAvailableFloorToPark(state) {
  let floor = NaN;
  do {
    floor = Math.floor(Math.random() * state.floors.length);
  } while (state.floors[floor].available === 0);
  return floor;
}

export function findPossibleFloorToLeave(state) {
  let floor = NaN;
  do {
    floor = Math.floor(Math.random() * state.floors.length);
  } while (state.floors[floor].available === state.floors[floor].spaces);
  return floor;
}

export function park(state, floor) {
  const floors = [...state.floors];
  floors[floor] = {
    ...state.floors[floor],
    available: state.floors[floor].available - 1,
  };

  return {
    ...state,
    totalAvailable: state.totalAvailable - 1,
    floors: floors,
  };
}

export function leave(state, floor) {
  const floors = [...state.floors];
  floors[floor] = {
    ...state.floors[floor],
    available: state.floors[floor].available + 1,
  };

  return {
    ...state,
    totalAvailable: state.totalAvailable + 1,
    floors: floors,
  };
}

// Initial state from lot description
export function initialState({ floors, ...rest }) {
  const spaces = floors.reduce((acc, { spaces }) => {
    return acc + spaces;
  }, 0);

  return {
    ...rest,
    totalSpaces: spaces,
    totalAvailable: spaces,
    floors: floors.map((floor) => {
      return { ...floor, available: floor.spaces };
    }),
  };
}

// The "app" resets when reloading and moving between pages,
// the latter can be resolved by moving to Redux Toolkit if
// this as a pure client side application.

// In a real world scenario a dashboard for parking would be
// highly coupled to a backend though.
// Redux Toolkit would still be a viable solution with RTK Queries,
// or go for an approach with ReactQuery.

export function reducer(state, action) {
  switch (action.type) {
    case "park":
      // Return early if disabled
      if (!parkEnabled(state, action.floor)) return state;
      // Use park action both for random and floor specific parking
      if (action.floor === undefined) {
        // Makes reducer "unpure", should refactor
        return park(state, findAvailableFloorToPark(state));
      } else {
        return park(state, action.floor);
      }

    case "leave":
      // Return early if disabled
      if (!leaveEnabled(state, action.floor)) return state;
      // Use park action both for random and floor specific leaving
      if (action.floor === undefined) {
        // Makes reducer "unpure", should refactor
        return leave(state, findPossibleFloorToLeave(state));
      } else {
        return leave(state, action.floor);
      }

    default:
      throw new Error();
  }
}

const LotApp = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState(props));
  const { totalAvailable, totalSpaces, floors } = state;
  return (
    <>
      <h2>{state.name}</h2>
      <p>
        {totalAvailable} out of {totalSpaces} available
      </p>
      {floors.map((floor, key) => {
        const { name, available, spaces } = floor;
        return (
          <details key={key} open={key === 0}>
            <summary style={{ color: available === 0 ? "red" : "inherit" }}>
              {name}: {available} out of {spaces} available
            </summary>
            <button
              disabled={!parkEnabled(state, key)}
              onClick={() => dispatch({ type: "park", floor: key })}
            >
              Park
            </button>{" "}
            <button
              disabled={!leaveEnabled(state, key)}
              onClick={() => dispatch({ type: "leave", floor: key })}
            >
              Leave
            </button>
          </details>
        );
      })}
      <button
        disabled={!parkEnabled(state)}
        onClick={() => dispatch({ type: "park" })}
      >
        Park any floor
      </button>{" "}
      <button
        disabled={!leaveEnabled(state)}
        onClick={() => dispatch({ type: "leave" })}
      >
        Leave any floor
      </button>
    </>
  );
};

export default LotApp;
