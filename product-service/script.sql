create extension if not exists "uuid-ossp";

create table products (
	id uuid not null default uuid_generate_v4() primary key,
	title text not null,
	description text,
	price integer
);

create table stocks (
	product_id uuid primary key,
  	count integer,
    FOREIGN key (product_id) REFERENCES products(id) ON DELETE CASCADE
);

insert into products (title, description, price) values ('Product 1', 'Description 1', 120);
insert into products (title, description, price) values ('Product 2', 'Description 2', 50);
insert into products (title, description, price) values ('Product 3', 'Description 3', 100);

insert into stocks (product_id, count) select id, 42 as count from products where title='Product 1';
insert into stocks (product_id, count) select id, 15 as count from products where title='Product 2';
insert into stocks (product_id, count) select id, 36 as count from products where title='Product 3';
