/// <reference path="Turtle.ts" />
/// <reference path="LSystem.ts" />

var ruleMakerTemplate = document.querySelector(".templates .maker-single-rule");
var lsystemTemplate = document.querySelector(".templates .lsystem");

var lsystemPredecessorTemplate = document.createElement("DT");
var lsystemSuccessorTemplate = document.createElement("DD");

var instructionMakerTemplate = document.querySelector(".templates .maker-draw-instruction");

lsystemPredecessorTemplate.className = "lsystem-predecessor";
lsystemSuccessorTemplate.className = "lsystem-successor";


var addRuleMaker = (form) => {
    var newRuleMaker = ruleMakerTemplate.cloneNode(true);
    form.querySelector(".maker-rules-list").appendChild(newRuleMaker);
};

var addInstructionMaker = (form) => {
    var newInstructionMaker = instructionMakerTemplate.cloneNode(true);
    form.querySelector(".maker-instructions-list").appendChild(newInstructionMaker);
};

var lSystem: LSystem;

var buildLSystem = (form) => {
    var rules: ProductionRule[] = [];

    for (var i = 0; i < form["predecessor"].length; i++)
    {
        if (form["predecessor"][i].value !== "")
        {
            rules.push(new ProductionRule(form["predecessor"][i].value, form["successor"][i].value));
        }
    }

    lSystem = new LSystem([], rules, form["start"].value);

    var lSystemData = <HTMLElement> lsystemTemplate.cloneNode(true);

    lSystemData.querySelector(".lsystem-do-recursion").addEventListener("click", (e) => {
        e.preventDefault();
        var r = lSystem.doRecursion();
        var dl = (<HTMLElement>(<Node> e.target).parentNode).querySelector(".recursion-list");
        var counter = document.createElement("DT");
        counter.innerText = lSystem.recursionCounter.toString();
        var recursionNode = document.createElement("DD");
        recursionNode.innerText = r;
        dl.appendChild(counter);
        dl.appendChild(recursionNode);

        var l = <HTMLElement>(<HTMLElement>(<Node> e.target).parentNode).querySelector(".last-recursion");
        l.innerText = r;
    });

    var propertiesList = lSystemData.querySelector(".lsystem-properties-list");
    var startData = document.createElement('DD');
    startData.innerText = lSystem.start;
    propertiesList.appendChild(startData);

    var successorData, predecessorData;
    for (var i = 0; i < lSystem.rules.length; i++)
    {
        successorData = lsystemSuccessorTemplate.cloneNode(false);
        successorData.innerText = lSystem.rules[i].successor;

        predecessorData = lsystemPredecessorTemplate.cloneNode(false);
        predecessorData.innerText = lSystem.rules[i].predecessor;
        propertiesList.appendChild(predecessorData);
        propertiesList.appendChild(successorData);
    }

    form.appendChild(lSystemData);

};

var addRuleMakerButtons = document.getElementsByClassName("maker-add-rule-button");
var addDrawInstructionsButtons = document.getElementsByClassName("maker-add-instruction-button");
var makeLSystemButtons = document.getElementsByClassName("maker-make-button");

var drawInstructionsButtons = document.getElementsByClassName("lsystem-draw-recursion-button");

Array.prototype.forEach.call(
    addRuleMakerButtons,
    (elem) => elem.addEventListener("click", (e) => { e.preventDefault(); addRuleMaker(e.target.form) } )
);
Array.prototype.forEach.call(
    addDrawInstructionsButtons,
    (elem) => elem.addEventListener("click", (e) => { e.preventDefault(); addInstructionMaker(e.target.form) } )
);
Array.prototype.forEach.call(
    makeLSystemButtons,
    (elem) => elem.addEventListener("click", (e) => { e.preventDefault(); buildLSystem(e.target.form) } )
);
Array.prototype.forEach.call(
    drawInstructionsButtons,
    (elem) => elem.addEventListener("click", (e) => { e.preventDefault(); buildLSystem(e.target.form) } )
);
