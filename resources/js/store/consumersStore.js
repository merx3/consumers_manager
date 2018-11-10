import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const evalLaravelValidation = (validator, value) => {
    for (let field in validator.rules) {
        let rules = validator.rules[field].laravelValidation;
        let isInt = false;
        for (let i = 0; i < rules.length; i++) {
            let ruleName = rules[i][0];
            let ruleArgs = rules[i][1];
            let ruleErrMsg = rules[i][2];
            switch (ruleName) {
                case 'Required':
                    if (typeof value[field] === 'undefined') {
                        return  ruleErrMsg;
                    }
                    break;
                case 'Integer':
                    if (!/^[1-9]\d*$/.test(value[field])) {
                        return ruleErrMsg;
                    }
                    isInt = true;
                    break;
                case 'Min':
                    let minVal = parseInt(ruleArgs[0]);
                    if (isInt ? value[field] < minVal : value[field].length < minVal) {
                        return ruleErrMsg;
                    }
                    break;
                case 'Max':
                    let maxVal = parseInt(ruleArgs[0]);
                    if (isInt ? value[field] > maxVal : value[field].length > maxVal) {
                        return ruleErrMsg;
                    }
                    break;
                case 'In':
                    if (!ruleArgs.includes(value[field])) {
                        return ruleErrMsg + ' Allowed values: ' + ruleArgs.join(',');
                    }
                    break;
            }
        }
    }
    return true;
};

const consumersStore = new Vuex.Store({
    state: {
        consumers: [],
        validationRules: false,
        disableInputs: false
    },
    getters: {
        all: (state) => state.consumers,
        disableInputs: (state) => state.disableInputs
    },
    mutations: {
        set: (state, consumers) => state.consumers = consumers,
        add: (state, consumer) => {
            // adding is without saving, so we don't need to validate or send it to the server
            state.consumers.push(consumer)
        }
    },
    actions: {
        // TODO: add header, footer
        fetch: ({commit, state}) => {
            state.disableInputs = true;
            return axios.get('/consumers/all')
                .then(resp => {
                    state.disableInputs = false;
                    commit('set', resp.data.consumers);
                    state.validationRules = resp.data.validator;
                });
        },
        delete: ({state}, id) => {
            state.disableInputs = true;
            return axios.delete('/consumers/' + id)
                .then(resp => {
                    state.disableInputs = false;
                    if (resp.code === 404) {
                        return Promise.reject(resp.data.message);
                    } else {
                        state.consumers = state.consumers.filter(c => c.id !== id);
                        return true;
                    }
                });
        },
        save: ({state}, consumer) => {
            let validationResult = evalLaravelValidation(state.validationRules, consumer);
            if (validationResult !== true) {
                return Promise.reject(validationResult);
            }
            let handleResponse = response => {
                state.disableInputs = false;
                if (response.code === 422) {
                    return Promise.reject(Object.values(response.data.errors)[0][0]);
                } else {
                    let consumerObj = state.consumers.find(c => c.id === consumer.id);
                    consumer.id = response.data.id;
                    Object.assign(consumerObj, consumer);
                    return true;
                }
            };
            state.disableInputs = true;
            if (!consumer.id) {
                return axios.post('/consumers', consumer)
                    .then(response => handleResponse(response));
            } else {
                return axios.put('/consumers/' + consumer.id, consumer)
                    .then(response => handleResponse(response));
            }
        }
    }
});

export default consumersStore;
