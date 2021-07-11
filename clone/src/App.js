import React, { useEffect } from "react";
import './App.css';

import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";






import Header from './Header';
import Home from './Home';
import Payment from './Payment';
import Checkout from "./Checkout";
import Login from "./Login";
import Orders from "./Orders";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';



const promise= loadStripe('pk_live_51JBqIgIqENf2a8fSU3g9uh8FSWq6QATcexn0XDLgbXaXLGTt7Q5aSOji4xdpxoTsjG9TIwCeXTxFnEt4aioWusIP004ubXzIA7')


function App() {
  const [{},dispatch] = useStateValue();

  useEffect(()=>{
    //will only run once when the app component loads...
    auth.onAuthStateChanged(authUser=>{
      console.log("The User is >>>>",authUser);

      if(authUser) {
        //the user just logged in / the user was logged in
        dispatch({
          type:"SET_USER",
          user:authUser
        })
      }else{
        //the user is logged out
        dispatch({
          type:"SET_USER",
          user:null
        })
      }
    });
  },[])

  return (
    <Router>
    <div className="App">
    
    
    <Switch>

    <Route path="/orders">
      <Header/>
      <Orders />
    </Route>


    <Route path="/login">
      <Login />
    </Route>

    <Route path="/payment">
    <Header />
    <Elements stripe={promise}>
    <Payment />
    </Elements>
    </Route>

    <Route path="/checkout">
      <Header/>
      <Checkout />
    </Route>

    <Route path="/">
      <Header/>
      <Home/>
    </Route>

    </Switch>
    </div>
    </Router>
  );
}

export default App;