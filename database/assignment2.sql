-- 1. Data for table `account`
INSERT INTO public.account (
        account_firstname,
        -- These are the values that are going to be inserted. You have to declare them in parenthesis and separate them by commas.
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Modify Tony Stark record to change account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- 3. Delete Tony Stark record from the database
DELETE FROM account
WHERE account_id = 1;
-- 4. Modify "GM HUMMER" description
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
-- 5. Use an inner join to select make and model from inventory and classification name 'Sport' from classification table.
SELECT inv.inv_make,
    inv.inv_model,
    inv.classification_id,
    c.classification_id,
    c.classification_name
FROM inventory inv
    INNER JOIN classification c ON inv.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Add /vehicles to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(
        inv_thumbnail,
        '/images',
        '/images/vehicles'
    );
