INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@startkent.com', 'Iam1ronM@n');

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

DELETE FROM public.account
WHERE account_firstname = 'Tony';

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10;

SELECT public.classification.classification_name, inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification
ON public.inventory.classification_id = public.classification.classification_id
WHERE public.inventory.classification_id = 2;

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');