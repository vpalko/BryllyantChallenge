db.createUser({user: 'mongoadmin', pwd: '123', 
    roles: [
            { role: "read", db: "demo" },
            { role: "readWrite", db: "demo" },
            { role: "dbAdmin",   db: "demo" },
            { role: "userAdmin", db: "demo" }
        ]});

db.userprofiles.insert(
{
    email: 'admin@example.com',
    phone: '9195551234',
    firstname: 'Admin',
    lastname: 'Bryllyant',
    isadmin: true,
    pwd: '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC'
});

db.userprofiles.insert(
{
    email: 'john@example.com',
    phone: '2155551234',
    firstname: 'John',
    lastname: 'Smith',
    isadmin: false,
    pwd: '$2b$10$FLOIG06GwRC91ftk2EZRi.hSCSfFaLEI08.Ohi2YQBjhsAiXfgVWC'
});
