import { Client } from "pg";
import { config } from "dotenv";
import mockData from "./mockData.json"; // Your generated mock data

// Load environment variables from .env file
config();

const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});

// Function to insert data into each table
const insertData = async () => {
  try {
    await client.connect();

    // Insert Users
    for (const user of mockData.users) {
      await client.query(
        `INSERT INTO users (id, name, username, role, active, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          user.id,
          user.name,
          user.username,
          user.role,
          user.active,
          user.password,
          user.createdAt,
          user.updatedAt,
        ]
      );
    }

    // Insert Clients
    for (const clientData of mockData.clients) {
      await client.query(
        `INSERT INTO clients (id, name, registration_number, website, notes, is_active, primary_address_id, primary_contact_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          clientData.id,
          clientData.name,
          clientData.registrationNumber,
          clientData.website,
          clientData.notes,
          clientData.isActive,
          clientData.primaryAddressId,
          clientData.primaryContactId,
          clientData.createdBy,
          clientData.createdAt,
          clientData.updatedBy,
          clientData.updatedAt,
        ]
      );
    }

    // Insert Suppliers
    for (const supplier of mockData.suppliers) {
      await client.query(
        `INSERT INTO suppliers (id, name, field, registration_number, website, notes, is_active, primary_address_id, primary_contact_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          supplier.id,
          supplier.name,
          supplier.field,
          supplier.registrationNumber,
          supplier.website,
          supplier.notes,
          supplier.isActive,
          supplier.primaryAddressId,
          supplier.primaryContactId,
          supplier.createdBy,
          supplier.createdAt,
          supplier.updatedBy,
          supplier.updatedAt,
        ]
      );
    }

    // Insert Addresses
    for (const address of mockData.addresses) {
      await client.query(
        `INSERT INTO addresses (id, address_line, city, country, supplier_id, client_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          address.id,
          address.addressLine,
          address.city,
          address.country,
          address.supplierId,
          address.clientId,
          address.createdBy,
          address.createdAt,
          address.updatedBy,
          address.updatedAt,
        ]
      );
    }

    // Insert Contacts
    for (const contact of mockData.contacts) {
      await client.query(
        `INSERT INTO contacts (id, name, phone, email, notes, supplier_id, client_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          contact.id,
          contact.name,
          contact.phone,
          contact.email,
          contact.notes,
          contact.supplierId,
          contact.clientId,
          contact.createdBy,
          contact.createdAt,
          contact.updatedBy,
          contact.updatedAt,
        ]
      );
    }

    // Insert Projects
    for (const project of mockData.projects) {
      await client.query(
        `INSERT INTO projects (id, name, status, description, start_date, end_date, notes, client_id, owner_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          project.id,
          project.name,
          project.status,
          project.description,
          project.startDate,
          project.endDate,
          project.notes,
          project.clientId,
          project.ownerId,
          project.createdBy,
          project.createdAt,
          project.updatedBy,
          project.updatedAt,
        ]
      );
    }

    // Insert Items
    for (const item of mockData.items) {
      await client.query(
        `INSERT INTO items (id, name, type, description, mpn, make, notes, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          item.id,
          item.name,
          item.type,
          item.description,
          item.mpn,
          item.make,
          item.notes,
          item.createdBy,
          item.createdAt,
          item.updatedBy,
          item.updatedAt,
        ]
      );
    }

    // Insert Project Items
    for (const projectItem of mockData.projectItems) {
      await client.query(
        `INSERT INTO project_items (id, project_id, item_id, supplier_id, quantity, price, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          projectItem.id,
          projectItem.projectId,
          projectItem.itemId,
          projectItem.supplierId,
          projectItem.quantity,
          projectItem.price,
          projectItem.notes,
        ]
      );
    }

    // Insert Documents
    for (const document of mockData.documents) {
      await client.query(
        `INSERT INTO documents (id, name, path, extension, notes, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          document.id,
          document.name,
          document.path,
          document.extension,
          document.notes,
          document.createdBy,
          document.createdAt,
        ]
      );
    }

    // Insert Document Relations
    for (const documentRelation of mockData.documentsRelations) {
      await client.query(
        `INSERT INTO documents_relations (id, document_id, project_id, supplier_id, item_id, client_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          documentRelation.id,
          documentRelation.documentId,
          documentRelation.projectId || null,
          documentRelation.supplierId || null,
          documentRelation.itemId || null,
          documentRelation.clientId || null,
        ]
      );
    }

    console.log("All mock data inserted successfully.");
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    await client.end();
  }
};

// Execute data insertion
insertData();
