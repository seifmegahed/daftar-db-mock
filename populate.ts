import pg from "pg";
import { config } from "dotenv";
// @ts-ignore
import mockData from "./mockData.json" with { type: "json" };

// Load environment variables from .env file
const configResult = config();

const connectionString = `postgresql://${configResult.parsed.DATABASE_USER}:${configResult.parsed.DATABASE_PASSWORD}@${configResult.parsed.DATABASE_HOST}:${configResult.parsed.DATABASE_PORT}/${configResult.parsed.DATABASE_NAME}`;

const client = new pg.Pool({
  connectionString,
});

// Function to insert data into each table
const insertData = async () => {
  try {

    // Insert Users
    for (const user of mockData.users) {
      await client.query(
        `INSERT INTO "user" (id, name, username, role, active, password, created_at, updated_at, last_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user.id,
          user.name,
          user.username,
          user.role,
          user.active,
          user.password,
          user.createdAt,
          user.updatedAt,
          user.lastActive,
        ]
      );
    }

    // Insert Clients
    for (const clientData of mockData.clients) {
      await client.query(
        `INSERT INTO "client" (id, name, registration_number, website, notes, is_active, primary_address_id, primary_contact_id, created_by, created_at, updated_by, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
        `INSERT INTO "supplier" (id, name, field, registration_number, website, notes, is_active, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
        [
          supplier.id,
          supplier.name,
          supplier.field,
          supplier.registrationNumber,
          supplier.website,
          supplier.notes,
          supplier.isActive,
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
        `INSERT INTO "address" (id, name, address_line, city, country, supplier_id, client_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          address.id,
          address.name,
          address.addressLine,
          address.city,
          address.country,
          address.supplierId ?? null,
          address.clientId ?? null,
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
        `INSERT INTO "contact" (id, name, phone_number, email, notes, supplier_id, client_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          contact.id,
          contact.name,
          contact.phone,
          contact.email,
          contact.notes,
          contact.supplierId ?? null,
          contact.clientId ?? null,
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
        `INSERT INTO "project" (id, name, status, description, start_date, end_date, notes, client_id, owner_id, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
        `INSERT INTO "item" (id, name, type, description, mpn, make, notes, created_by, created_at, updated_by, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
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
        `INSERT INTO "project_items" (id, project_id, item_id, supplier_id, quantity, price, currency) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          projectItem.id,
          projectItem.projectId,
          projectItem.itemId,
          projectItem.supplierId,
          projectItem.quantity,
          projectItem.price,
          projectItem.currency,
        ]
      );
    }

    // Insert Documents
    for (const document of mockData.documents) {
      await client.query(
        `INSERT INTO "document" (id, name, path, extension, notes, created_by, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
        `INSERT INTO "document_relations" (id, document_id, project_id, supplier_id, item_id, client_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          documentRelation.id,
          documentRelation.documentId,
          documentRelation.projectId ?? null,
          documentRelation.supplierId ?? null,
          documentRelation.itemId ?? null,
          documentRelation.clientId ?? null,
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
