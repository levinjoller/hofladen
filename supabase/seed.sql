SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."persons" ("id", "created_at", "display_name") VALUES
	(1, '2025-07-13 09:18:10.997918+00', 'Hoffmann AG'),
	(2, '2025-07-13 11:10:24.08498+00', 'Elmiger AG');


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customers" ("id", "created_at", "fk_person") VALUES
	(1, '2025-07-13 12:30:26.957072+00', 1);


--
-- Data for Name: palox_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."palox_types" ("id", "created_at", "label_prefix", "display_name", "description") VALUES
	(1, '2025-07-25 09:38:13.09273+00', 'STD', 'Holz', NULL),
	(2, '2025-07-25 09:38:30.35089+00', 'AGR', 'Plastik', NULL);


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "created_at", "display_name") VALUES
	(1, '2025-07-11 15:22:06.938267+00', 'Äpfel Gala'),
	(2, '2025-07-12 12:57:14.273863+00', 'Karotten'),
	(4, '2025-07-12 13:53:44.658582+00', 'Salat'),
	(5, '2025-07-12 14:02:43.722838+00', 'Bohnen');


--
-- Data for Name: stocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stocks" ("id", "created_at", "display_name") VALUES
	(1, '2025-07-13 17:46:32.35945+00', '1');


--
-- Data for Name: stock_columns; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stock_columns" ("id", "created_at", "display_name", "fk_stock", "x_position") VALUES
	(1, '2025-07-13 17:47:16.036281+00', 'A', 1, 0),
	(2, '2025-07-15 13:54:19.013483+00', 'B', 1, 1),
	(3, '2025-07-15 13:54:52.762284+00', 'C', 1, 2),
	(4, '2025-07-15 13:55:17.637164+00', 'D', 1, 3);


--
-- Data for Name: stock_column_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stock_column_slots" ("id", "created_at", "display_name", "fk_stock_column", "y_position") VALUES
	(1, '2025-07-13 17:49:22.848254+00', '1', 1, 0),
	(2, '2025-07-15 13:56:49.913288+00', '2', 1, 1),
	(3, '2025-07-15 13:57:34.933579+00', '3', 1, 2),
	(4, '2025-07-15 13:58:03.226428+00', '4', 1, 3),
	(5, '2025-07-15 13:58:31.974871+00', '1', 2, 0),
	(6, '2025-07-15 13:58:50.887704+00', '2', 2, 1),
	(7, '2025-07-15 13:59:09.112671+00', '3', 2, 2),
	(8, '2025-07-15 13:59:27.033554+00', '4', 2, 3),
	(9, '2025-07-15 13:59:49.837629+00', '1', 3, 0),
	(10, '2025-07-15 14:00:05.942211+00', '2', 3, 1),
	(11, '2025-07-15 14:00:22.080056+00', '3', 3, 2),
	(12, '2025-07-15 14:00:45.550345+00', '4', 3, 3),
	(13, '2025-07-15 14:01:05.081254+00', '1', 4, 0),
	(14, '2025-07-15 14:01:24.791937+00', '2', 4, 1),
	(15, '2025-07-15 14:01:42.355299+00', '3', 4, 2),
	(16, '2025-07-15 14:01:55.463444+00', '4', 4, 3);


--
-- Data for Name: stock_column_slot_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stock_column_slot_levels" ("id", "created_at", "fk_stock_column_slot", "is_taken", "level", "display_name", "max_level") VALUES
	(1, '2025-07-13 17:49:57.929309+00', 1, true, 0, '1', 1),
	(2, '2025-07-14 15:11:13.055369+00', 1, true, 1, '2', 1),
	(3, '2025-07-15 14:04:15.8248+00', 2, false, 0, '1', 1),
	(4, '2025-07-15 14:04:39.294914+00', 2, false, 1, '2', 1);


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."suppliers" ("id", "created_at", "fk_person") VALUES
	(3, '2025-07-13 09:18:34.100992+00', 1),
	(4, '2025-07-13 11:10:39.209126+00', 2);


--
-- Data for Name: paloxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."paloxes" ("id", "created_at", "fk_customer", "fk_product", "fk_supplier", "fk_stock_column_slot_level", "updated_at", "fk_palox_type", "number_per_type") VALUES
	(1, '2025-07-24 12:44:42.073579+00', 1, 1, NULL, 1, '2025-07-24 12:44:42.073579', 1, 1),
	(2, '2025-07-24 12:45:24.055213+00', NULL, 2, 4, 2, '2025-07-24 12:45:24.055213', 2, 1);


--
-- Data for Name: palox_histories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: column_spots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."column_spots_id_seq"', 16, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."customers_id_seq"', 1, true);


--
-- Name: palox_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."palox_histories_id_seq"', 1, false);


--
-- Name: palox_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."palox_types_id_seq"', 2, true);


--
-- Name: paloxes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."paloxes_id_seq"', 2, true);


--
-- Name: person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."person_id_seq"', 2, true);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."product_id_seq"', 5, true);


--
-- Name: rows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."rows_id_seq"', 4, true);


--
-- Name: slot_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."slot_levels_id_seq"', 4, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."suppliers_id_seq"', 4, true);


--
-- Name: warehouse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."warehouse_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
