### Balow lone gives us all resources. like imagine a user has access to factories route only and another one has access to cases only then we will have both cases and factories in objs.
```javascript
let objs = await auther.GetEnforcer().getAllObjects();
```

### Below line gives us all actions. Like imagine a user can read factories and another user can delete users so we will have both read and delete in acts.
```javascript
let acts = await auther.GetEnforcer().getAllActions();
```

### Below line gives all roles. Here we have: ['user', ''admin' , 'factory']
```javascript
const rawRoles = await auther.GetEnforcer().getAllSubjects();
```