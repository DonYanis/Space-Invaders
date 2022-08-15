const gameGrid = document.querySelector('.game-grid')
const gameScore = document.querySelector('.score')
const player = document.querySelector('.player')
const easyGame = document.querySelector('.easy')
const normalGame = document.querySelector('.normal')
const hardGame = document.querySelector('.hard')
const gameMenu = document.querySelector('.menu')
const gameMenuScore = document.querySelector('.final-score')

const divWidth=30
const rowDivCount=parseInt(window.getComputedStyle(gameGrid).width.replace('px',''))/divWidth
const colDivCount=parseInt(window.getComputedStyle(gameGrid).height.replace('px',''))/divWidth
const nbDiv=rowDivCount*colDivCount

let lost, direction, moveDown, score, game
let playerPosition
let aliens, aliensClass

for (let i = 0; i < nbDiv ; i++) {
    gameGrid.appendChild(document.createElement('div'))   
}
const gridCells = document.querySelectorAll('.game-grid div')

document.addEventListener('keydown', (e)=> {
    if (!lost){
        if (e.keyCode === 37 && playerPosition> nbDiv-rowDivCount) { //left
            gridCells[playerPosition].classList.remove('player')
            playerPosition-=1
            gridCells[playerPosition].classList.add('player')
            
        } else if (e.keyCode === 39 && playerPosition< nbDiv-1) { //right
            gridCells[playerPosition].classList.remove('player')
            playerPosition+=1
            gridCells[playerPosition].classList.add('player')
        } 
        else if (e.keyCode === 32) { //shoot
            shoot()
        }
    }
})

function placeAliens(){
    gridCells.forEach((div,index) =>{
        if(aliens.includes(index)){
            div.classList.add('alien')
            let typeOfAlien=aliensClass[aliens.indexOf(index)].getType()
            div.style["background-image"]=`url(../images/ship${typeOfAlien}.png)` 
        }
    })
}

function removeAliens(){
    gridCells.forEach((div,index) =>{
        if(aliens.includes(index)){
            div.classList.remove('alien')
            div.style.removeProperty("background-image") 
        }
    })
}

function getRightEdge(){
    let max=0
    aliens.forEach((pos) => {
        if (pos % rowDivCount > max%rowDivCount){
            max = pos
        }
    })
    return max
}

function getLeftEdge(){
    let min=rowDivCount-1
    aliens.forEach((pos) => {
        if (pos % rowDivCount < min% rowDivCount ){
            min = pos
        }
    })
    return min
}

function moveAliens(){
    if(getLeftEdge()%rowDivCount===0){
        direction*=-1
        moveDown=true
    }else if(getRightEdge()%rowDivCount>=rowDivCount-1){
        direction*=-1
        moveDown=true
    }
     
    removeAliens()

    for (let i = 0; i < aliens.length; i++) {
        if(moveDown){
            aliens[i]+=rowDivCount+direction
            
        }else{
            aliens[i]+=direction
        }
        aliensClass[i].setPos(aliens[i])
    }

    if(moveDown || aliens.length ===0){
        let newAliens=Math.floor(Math.random()*7)+2
        for (let i = 0; i < newAliens; i++) {
            let alienPos = Math.floor(Math.random()*8)+1    
            while( aliens.includes(alienPos)){
                alienPos = Math.floor(Math.random()*8)+1
            }
            aliens.unshift(alienPos)
            aliensClass.unshift(new Alien(alienPos,Math.floor(Math.random()*3)+1))
        }
    }
    
    moveDown=false
    placeAliens()

//game over
    if( Math.max(...aliens)>=nbDiv-rowDivCount || gridCells[playerPosition].classList.contains('alien','player')){
        clearInterval(game)
        lost=true
        gameMenu.style.display='block'
        gameMenuScore.innerHTML=`Score : ${score}`
        removeAliens()
        gridCells[playerPosition].classList.remove('player')
    }
}

function shoot(){
    let shotPosition=playerPosition

    function moveShot(){
        gridCells[shotPosition].classList.remove('shot')
        shotPosition-=rowDivCount
        if(shotPosition<0){
            clearInterval(playerShot)
        }else{
            gridCells[shotPosition].classList.add('shot')
        
            if(gridCells[shotPosition].classList.contains('alien')){

                gridCells[shotPosition].classList.remove('shot')
                gridCells[shotPosition].classList.remove('alien')
                gridCells[shotPosition].style.removeProperty("background-image") 
                gridCells[shotPosition].classList.add('death')

                setTimeout(()=>{
                    gridCells[shotPosition].classList.remove('death')
                },100)

                aliens.splice(aliens.indexOf(shotPosition),1)
                aliensClass.splice(aliens.indexOf(shotPosition),1)
                clearInterval(playerShot)
                score++
                gameScore.innerHTML=`Score : ${score}`
            }
        }
    }
    let playerShot=setInterval(moveShot,100)
}

function newGame(difficulty){
    lost=false
    aliens=[1,2,3,5,11,22,24,25]
    direction=1
    moveDown=false
    score=0
    playerPosition=parseInt(nbDiv-(rowDivCount/2))
    aliensClass=Alien.createAliensFromArray(aliens)
    gameMenu.style.display='none'
    gridCells[playerPosition].classList.add('player')
    removeAliens()
    placeAliens()
    game=setInterval(moveAliens,difficulty)

}

easyGame.addEventListener("click",()=>{newGame(1000)})
normalGame.addEventListener("click",()=>{newGame(600)})
hardGame.addEventListener("click",()=>{newGame(300)})

//last minute saving class hhhhhhh
class Alien{
    #pos
    #type
    constructor(pos,type){
        this.#pos=pos
        this.#type=type
    }

    getPos(){
        return this.#pos
    }

    setPos(pos){
        this.#pos=pos
    }

    getType(){
        return this.#type
    }

    static createAliensFromArray(arr){ 
        let alienArr=[]
        arr.forEach((elem) => {
            let a=new Alien(elem,Math.floor(Math.random()*3)+1)
            alienArr.push(a)
        })
        return alienArr
    }
}