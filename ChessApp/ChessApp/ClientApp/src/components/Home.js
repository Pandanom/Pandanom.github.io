import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  render() {
      return (
        <div>
        <div class="header-container">
    <div class="header-body">
      <label>Chess</label>
      <button class="open-button">Open Form</button>
      <div class="form-popup" id="myForm">
        <form class="form-container">
          <h1>Connect to game</h1>
          <label for="gameId"><b>Game id</b></label>
                        <input type="text" placeholder="(leave empty if you want create new game)" name="gameId" id="gameId"></input>
          <label for="gameType">Choose game type</label>
                            <div class="rb">
                                <input type="radio" value="hw"></input>
            <span>Host white</span>
          </div>
          <div class="rb">
                            <input type="radio" value="hb" ></input>
            <span>Host black</span>
          </div>
          <div class="rb">
                            <input type="radio" value="r" ></input>
            <span>Random</span>
          </div>
          <label for="isRaiting">Make game raiting</label>
          <div class="rb">
                            <input type="checkbox" value="Raiting game"></input>
            <span>Raiting game</span>
          </div>
          <button type="submit" class="btn">Create or connect</button>
          <button type="button" class="btn cancel">Close</button>
        </form>
      </div>
    </div>
  </div>
<main class="gameMain" id="game">
  <div class="sidebox">
    <label>Chat</label>
    <textarea readonly id="chatbox"/>
    <form class="message">
                    <input name="usermsg" type="text" id="usermsg"/>
                <input name="submitmsg" type="submit" id="submitmsg" value="Send"/>
    </form>
  </div>
  <div class="board">
    <div id='boardOuter'>
      <div id='boardInner'>
      </div>
    </div>
  </div>
  <div class="sidebox">
    <label>History</label>
    <textarea readonly id="historyBox"></textarea>
  </div>

      </main >
</div >
    );
  }
}
