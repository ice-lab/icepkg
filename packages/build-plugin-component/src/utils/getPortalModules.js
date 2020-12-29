const path = require('path');

let modulesInfo = {
  modules: {
    device: path.join(__dirname, '../template/device.hbs'),
  },
  params: {},
};

function setModulesInfo(info) {
  const { modules = {}, params = {} } = info || {};
  modulesInfo = {
    modules: {
      ...modulesInfo.modules,
      ...modules,
    },
    params: {
      ...modules.params,
      ...params,
    },
  };
}

function getModulesInfo() {
  return modulesInfo;
}


module.exports = {
  getModulesInfo,
  setModulesInfo,
};
