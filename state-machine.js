/*State machine*/
function StateMachine(e){
	e.states = [];
	e.defaultState = {
		mousedown:function(event){
			
		},
		mousemove:function(){
		}
	}
	e.currentState = e.defaultState;
	e.setCurrentState = function (state){
		
	}
};