<style>
    .main-panel {
        max-width: 330px;
        padding: 15px;
        margin: 0 auto;
    }

</style>
<div class="container todo-main-container">
    <section id="usertimelineapp" ng-controller="UserTimelineCtrl">

            <h1>todos</h1>
              <li ng-repeat="todo in userTimeline ">
                {{todo}}
                </li>


    </section>
    <footer id="info">
        <p>Credits:
            <a href="http://twitter.com/cburgdorf">Innocenzo Biondo</a>,
            <a href="http://ericbidelman.com">Marco Grani</a>,
            <a href="http://jacobmumm.com">Stefano Perrone</a> and
        </p>
    </footer>
</div>
