async function changeState(state, data){
    global.db.models.State.update({data: data}, {
        where: {
            state: state
        }
    })
}

async function getState(state){
    return global.db.models.State.findOne({
        where: {
            state: state
        }
    })
}

module.exports = { getState, changeState };