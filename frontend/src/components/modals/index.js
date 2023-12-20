import Add from './Add-channel.jsx';
import Remove from './Remove-channel.jsx';
//import Rename from './Rename.jsx';

const modals = {
  adding: Add,
  removing: Remove,
  //renaming: Rename,
};

export default (modalName) => modals[modalName];