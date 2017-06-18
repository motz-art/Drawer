/**
 * Created by IntelliJ IDEA.
 * User: oleg
 * Date: 03.01.2011
 * Time: 14:31:06
 * To change this template use File | Settings | File Templates.
 */
window.testSets = {};

function motzUnitGetReady(){
    for(var name in window.testSets){
        var li = $('<li>'+name+'</li>');
        $('#testSets').append(li);
        var ul = li.append('<ul></ul>');
        for(var testName in window.testSets[name]){
            var test = window.testSets[name][testName];
            var testCase = $('<li>'+testName+'</li>').click(function(){
                        $(this).append(' - '+test());
            });
            ul.append(testCase);
        }
    }
};