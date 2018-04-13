window.flux = {
    ev: [],
    subscribe: function(func, componentName) {
        for(key in this.ev) {
            if(key == componentName) {
                return;
            }
        }
        if(func.$parent.state) {
            for(var key in func.$parent.state) {
                func[key] = func.$parent.state[key];
            }
        }
        this.ev[componentName] = func;
    },
    dispatch: function(funcName, data) {
        for(var key in this.ev) {
            var parent = this.ev[key].$parent ? this.ev[key].$parent : this.ev[key];
            var actions = parent.actions;
            if(actions && actions[funcName]) {
                actions[funcName].call(this.ev[key], data);
            }
        }
    },
    call: function(componentName, funcName) {
        if(this.ev[componentName]) {
            arguments = [].slice.call(arguments,0);
            arguments.splice(0, 2);
            this.ev[componentName][funcName].apply(this.ev[componentName], arguments);
        }
    }
}