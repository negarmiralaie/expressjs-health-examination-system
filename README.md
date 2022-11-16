# teb-kar

> For creating a new migration:
```bash
sequelize-mig migration:make -n <migration name>
npx sequelize-cli db:migrate
```

> In case of any errors for docker:
```bash
sudo ss -lptn 'sport = :5432'
sudo kill [pid]
docker rm [containerId] --force
```

# PERSONNEL
<!-- 1. TO CREATE A 'پرسنل' PROVIDE role = 'personnel'..... -->
1. TO CREATE A 'پرسنل' personelNo MUST NOT BE REPEATED....

1. Sample personnel
```json
{
    "id": 1,
	"factoryName": "factoryName1",
	"examinationType": "موردی",
	"date": "1401-09-01",
	"fileNo": "fileNo1",
	"personalNo": "298878",
	"fullName": "fullName1",
	"fatherName": "fatherName1",
	"gender": "زن",
	"maritalStatus": "مجرد",
	"childrenNumber": "0",
	"birthYear": "1362-01-09",
	"SSN": "12135988",
	"militaryStatus": "سپاه",
	"serviceLine": "زرهی",
	"description": "description1",
}
```





# USER
> User can have 5 roles: admin(ادمین), examiner(کاربر-ثبات), generalManager(مدیرکل), client(مشتری), communications(ارتباطات)

> TO CREATE A 'کاربر' MOBILE & USERNAME MUST BE UNIQUE....

1. Sample users.... role: ثبات:
```json
{
   "id": 1,
	"factoryName": "factoryName1",
	"fullName": "fullName1",
	"username": "username1",
	"password": "password1",
	"role": "ثبات",
	"email": "email1@gmail.com",
	"mobile": "9545338439",
	"phone": "24415470",
	"address": "address1",
	"expirationDate": "1401-09-21",
	"dedicatedIp": "12.12.12.14",
	"status": "active"
}
```
```json
{
   "id": 2,
	"factoryName": "factoryName1",
	"fullName": "fullName2",
	"username": "username2",
	"password": "password2",
	"role": "مشتری",
	"email": "email2@gmail.com",
	"mobile": "9381238132",
	"phone": "23213342",
	"address": "address2",
	"expirationDate": "1401-08-20",
	"dedicatedIp": "12.12.12.12",
	"status": "inactive"
}
```
```json
{
   "id": 3,
	"factoryName": "factoryName1",
	"fullName": "fullName3",
	"username": "username3",
	"password": "password3",
	"role": "ادمین",
	"email": "email3@gmail.com",
	"mobile": "9285738439",
	"phone": "25117479",
	"address": "address3",
	"expirationDate": "1402-09-11",
	"dedicatedIp": "12.12.12.16",
   "status": "active"
}
```
> Factories also need to provide username and password so that they can login later. Factories will have a property called 'role' which is equal to 'factory' so that we can distinguish between factories and users after they logged in.
........................................................................................................................................................................................................................

<!-- > To see if a form is filled, user virtual field of each form called 'isFilled';
> To see 'لیست پرسنل صنایع' use following endpoint: 
> To see 'لیست پرسنل صنایع من' use following endpoint:
> To see 'لیست کاربران' use following endpoint: http://localhost:3000/api/v1/admin/users?page=1&limit=5&filter[order][sort]=desc&filter[where][role]=admin -->


# ROLES

{
  "title": "ادمین",
  "permissions": [
        {
            "obj": "dashboard",
            "acts": ["create", "read", "update", "delete"]
        },
        {
            "obj": "manage-users",
            "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "factories",
           "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "suggestions",
           "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "reports",
            "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "users-activity",
            "acts": ["create", "read", "update", "delete"]
        },
			  {
            "obj": "settings",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "edit-profile",
            "acts": ["create", "read", "update", "delete"]
        }
    ],
	  "title": "ثبات",
  "permissions": [
		    {
            "obj": "personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "users",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "edit-profile",
            "acts": ["create", "read", "update", "delete"]
        }
    ],
	  "title": "مدیرکل",
  "permissions": [
        {
            "obj": "dashboard",
           "acts": ["create", "read", "update", "delete"]
        },
        {
            "obj": "manage-users",
            "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "factories",
           "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "suggestions",
           "acts": ["read", "update", "delete"]
        },
		    {
            "obj": "reports",
            "acts": ["create", "read", "update", "delete"]
        },
		    {
            "obj": "users-activity",
            "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "تنظیمات",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "edit-profile",
            "acts": ["create", "read", "update", "delete"]
        }
    ],
	  "title": "مشتری",
  "permissions": [
				{
            "obj": "my-personnels",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "my-cases",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "suggestions",
           "acts": ["create"]
        },
		    {
            "obj": "reports",
            "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "edit-profile",
            "acts": ["create", "read", "update", "delete"]
        }
    ],
	"title": "ارتباطات",
  "permissions": [
				{
            "obj": "suggestions",
           "acts": ["create", "read", "update", "delete"]
        },
				{
            "obj": "edit-profile",
            "acts": ["create", "read", "update", "delete"]
        }
    ]
}