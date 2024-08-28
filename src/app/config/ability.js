import { Ability, AbilityBuilder } from '@casl/ability';
import store from "../../redux/store";

// Defines how to detect object's type
function subjectName(item) {
  if (!item || typeof item === 'string') {
    return item;
  }
  return item.__type;
}

const ability = new Ability([], { subjectName });

let currentAuth;
store.subscribe(() => {
  const prevAuth = currentAuth;
  //const { auth: { authToken } } = store.getState();
  const { auth: { user } } = store.getState();
  currentAuth = user //store.getState().user;
  if (prevAuth !== currentAuth) {
    ability.update(defineRulesFor(currentAuth));
  }
});

function defineRulesFor(auth) {
  const { can, cannot, rules } = AbilityBuilder.extract();
  if (auth && auth.isAdmin == true) {
    can('view', 'manage-custom-market');
    can('view', 'custom-market-tree-action');
    can('view', 'menu-maestros');
    can('view', 'menu-usuarios');
    can('view', 'menu-logs');
  }
  if (auth && auth.isAdmin == false) {
    cannot('view', 'manage-custom-market');
    cannot('view', 'menu-maestros');
    cannot('view', 'menu-usuarios');
  }
  return rules;
}

export default ability;