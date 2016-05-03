<style>
    .main-panel {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }
</style>
  <div id="map" style="height:300px; width:100%;"></div>
<div class="container todo-main-container">

    <section id="todoapp" ng-controller="ResultCtrl">


      <!-- {{initMap(results);}} -->
      <!-- <form id="todo-form"  ng-submit="callMap()"><input type="submit" value="Find into Map"></form> -->
        <header id="header">

            <h1>Points of Interests</h1>


            <form id="todo-form" ng-submit="callMap()">
                <input id="new-todo" type="submit" value="Find into Map" >
            </form>
        </header>
        <section id="main" ng-show="results[0].list_raccomended.length" ng-cloak>
            <input id="toggle-all" type="checkbox"  >
            <label for="toggle-all">Mark all as complete</label>
            <ul id="todo-list">
                <li ng-repeat="todo in results[0].list_raccomended " >
                    <div class="view">
                        <input class="toggle" type="checkbox"   >
                        <label ><em>Name:</em> {{todo.name}}      <div class="pull-right"> {{todo.macrocategory}}</div></label>
                        <button class="destroy" ></button>
                    </div>
                    <form ng-submit="">
                        <input class="edit"   >
                    </form>
                </li>
            </ul>
        </section>
        <footer id="footer" ng-show="results[0].list_raccomended.length" ng-cloak>
					<span id="todo-count"><strong></strong>
						<ng-pluralize count="6" when="{ one: 'item left', other: 'items left' }"></ng-pluralize>
					</span>
            <ul id="filters">
                <li>
                    <a ng-class="{selected: status == ''} " href='#' >All</a>
                </li>
                <li>
                    <a ng-class="{selected: status == 'active'}" href='#' >Active</a>
                </li>
                <li>
                    <a ng-class="{selected: status == 'completed'}"  href='#' >Completed</a>
                </li>
            </ul>
            <button id="clear-completed"  >Clear completed </button>
        </footer>
    </section>
    <footer id="info">
        <p>Credits:
            <a href="https://www.facebook.com/enzo.biondo.58">Innocenzo Biondo</a>,
            <a href="https://www.facebook.com/marco.grani">Marco Grani</a>,
            <a href="https://www.facebook.com/stefano.perrone.90.space">Stefano Perrone</a>
        </p>
    </footer>
</div>
