# 4.5.3 Context

---

### The "prop-drilling" problem.

"Lifting state" is a great trick.

Sometimes, it introduces a new problem though.

---

# Demonstration

Pass the props through in the following example

---

```jsx
const App = () => {
  const [user, setUser] = React.useState(null);

  return (
    <>
      <Home />
      <Sidebar user={user} />
    </>
  );
};

const Home = ({user}) => {
  return (
    <>
      <Header user={user}/>
      <MainContent />
    </>
  );
};

const Header = ({user}) => {
  return (
    <header>
      <Navigation user={user} />
    </header>
  );
};

const Navigation = ({user}) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <li>
            <Link to="/log-out">Log out</Link>
          </li>
        ) : (
          <li>
            <LoginDialogTrigger user={user}/>
          </li>
        )}
      </ul>
    </nav>
  );
};

const LoginDialogTrigger = ({user}) => {
  // Some stuff to show a button and handle showing
  // the dialog on click

  return (
    <form
      onSubmit={() => {
        /* Validate that the credentials are right */
        setUser(user);
      }}
    >
      {/* Imagine a typical login form here */}
    </form>
  );
};
```

---

This is no fun!

- Pain to wire up
- Not easy to move components around
- Makes a big mess

---

For _app-wide_ data like the current user, it would be cool if this was available anywhere without needing to "prop-drill"

---

# Context

Context is **global state** for your React tree.

---

# How it works

First, we create a Context, and make it available to the React tree with `<Context.Provider>`:

```js
export const UserContext = React.createContext(null);

const App = () => {
  return (
    <UserContext.Provider value={{ username: 'Alfalfa' }}> 
    // everything below will be able to access the value
      <Header />
      <Main>
        <YourAppHere />
      </Main>
    </UserContext.Provider>
  );
};
```

---

# How it works

Next, we can _consume_ that context anywhere below the Provider with `useContext`.

```js
import { UserContext } from '../App';

const Profile = () => {
  const data = React.useContext(UserContext);

  console.log(data); // { username: 'Alfalfa' }

  return <div>Logged in as {data.username}.</div>;
};
```

---

# Exercises

Update the following components to use context

---
ORIGINAL

```jsx
const App = () => {
  const [user, setUser] = React.useState({ username: 'Alfalfa' });

  return <Home user={user} setUser={setUser} />;
};

const Home = ({ user, setUser }) => {
  return (
    <>
      <Header user={user} setUser={setUser} />
      <MainContent />
    </>
  );
};

const Header = ({ user, setUser }) => {
  return (
    <header>
      <Navigation user={user} setUser={setUser} />
    </header>
  );
};

const Navigation = ({ user, setUser }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {user && (
          <li>
            <button onClick={() => setUser(null)}>Log out</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

MINE

```jsx
export const UserContext = React.createContext(null);
const App = () => {
  const [user, setUser] = React.useState({ username: 'Alfalfa' });
  return (
    <userContext.Provider value={{user, setUser}}>
      <Home/>;
    <userContext.Provider>
  )
};

const Home = () => {
  return (
    <>
      <Header />
      <MainContent />
    </>
  );
};

const Header = () => {
  return (
    <header>
      <Navigation  />
    </header>
  );
};

const Navigation = () => {

import [user, setUser] from '../App';
const {user, setUser} = React.useContext([user, setUser]);


  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {user && (
          <li>
            <button onClick={() => setUser(null)}>Log out</button>
          </li>
        )}
      </ul>
    </nav>
  );
};
```

---

NEW EX 
ORIGINA

```jsx
const App = () => {
  const [dialog, setDialog] = React.useState(null);

  return (
    <>
      <MainContent dialog={dialog} setDialog={setDialog} />
      <Dialog currentDialog={dialog} />
    </>
  );
};

const MainContent = ({ dialog, setDialog }) => {
  return (
    <>
      <Sidebar>
        <Link>Home</Link>
        <Link>About</Link>
        <LogInButton afterLogin={() => setDialog('login-success')} />
      </Sidebar>
      <Main>Stuff</Main>
    </>
  );
};

const Dialog = ({ currentDialog }) => {
  if (!currentDialog) {
    return null;
  }

  return <div>{/* Do stuff with currentDialog */}</div>;
};
```

```jsx
const App = () => {
  const [dialog, setDialog] = React.useState(null);

  return (
    <>
    <dialogContext.Provder value={{dialog,setDialog}}>
      <MainContent dialog={dialog} setDialog={setDialog} />
      <Dialog currentDialog={dialog} />
    </dialogContext.Provder>
  );
};

const MainContent = () => {
  const {setDialog} = usecontext(DialogContext);
  return (
    <>
      <Sidebar>
        <Link>Home</Link>
        <Link>About</Link>
        <LogInButton afterLogin={() => setDialog('login-success')} />
      </Sidebar>
      <Main>Stuff</Main>
    </>
  );
};

const Dialog = () => {
    const currentDialog = usecontext(DialogContext).dialog

  if (!currentDialog) {
    return null;
  }

  return <div>{/* Do stuff with currentDialog */}</div>;
};
```

---

```js live=true
const App = () => {
  const [count, setCount] = React.useState(0);
  const [name, setName] = React.useState('');

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <>
      Playing as: {name}
      <CountDisplay count={count} />
      <Actions
        increment={increment}
        decrement={decrement}
        name={name}
        setName={setName}
      />
    </>
  );
};

const CountDisplay = ({ count }) => {
  return <h1>{count} clicks!</h1>;
};

const Actions = ({ increment, decrement, name, setName }) => {
  return (
    <div>
      <TextInput label="Name" value={name} setValue={setName} />

      <Action onClick={increment}>Increment</Action>
      <Action onClick={decrement}>Decrement</Action>
    </div>
  );
};

// NO NEED TO TWEAK ANYTHING BELOW THIS POINT

const Action = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

const TextInput = ({ label, value, setValue }) => {
  return (
    <label>
      {label}
      <input
        type="text"
        value={value}
        onChange={ev => setValue(ev.target.value)}
      />
    </label>
  );
};

render(<App />);
```

---

# Context vs. Props

Should you _always_ reach for context? Is it OK to pass props?

---

For now, let's try and use Context liberally. We need the practice.

---

Once you're comfortable with it, the choice is yours.

There is no wrong answer. Do whatever is easiest for you!
