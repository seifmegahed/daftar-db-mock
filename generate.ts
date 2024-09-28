import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
// @ts-ignore
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const saltRounds = 10;

// Domain-specific data arrays
const engineeringFields = [
  "Generators",
  "Pumps",
  "Hydraulic Systems",
  "HVAC",
  "Marine Machinery",
];
const suppliersFields = [
  "Caterpillar",
  "Siemens",
  "Hitachi",
  "Schneider Electric",
  "KSB",
];
const cities = ["Cairo", "Alexandria", "Riyadh", "Beijing", "Berlin"];
const statusCodes = [
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
];
const currencyOptions = ["EGP", "USD", "EUR"];

// Helper to pick a random item from an array
const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Generate users with domain-specific roles
const generateUsers = (num: number) => {
  const users = [];
  for (let i = 1; i <= num; i++) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(faker.internet.password(), salt);
    users.push({
      id: i,
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      role: i % 5 === 0 ? "admin" : pickRandom(["engineer", "project_manager"]),
      active: faker.datatype.boolean(),
      password,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }
  return users;
};

// Generate addresses
const generateAddresses = (
  num: number,
  users: any[],
  suppliers: any[],
  clients: any[],
  startId: number = 0
) => {
  const getRandomRelation = () =>
    pickRandom([
      { supplierId: pickRandom(suppliers).id },
      { clientId: pickRandom(clients).id },
    ]);
  const addresses = [];
  for (let i = 1; i <= num; i++) {
    const randomRelation = getRandomRelation();
    addresses.push({
      id: startId + i,
      addressLine: faker.address.streetAddress(),
      city: pickRandom(cities),
      country: faker.address.country(),
      ...randomRelation,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return addresses;
};

// Generate contacts
const generateContacts = (
  num: number,
  users: any[],
  suppliers: any[],
  clients: any[],
  startId: number = 0
) => {
  const getRandomRelation = () =>
    pickRandom([
      { supplierId: pickRandom(suppliers).id },
      { clientId: pickRandom(clients).id },
    ]);

  const contacts = [];
  for (let i = 1; i <= num; i++) {
    const randomRelation = getRandomRelation();
    contacts.push({
      id: startId + i,
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      notes: faker.lorem.sentences(2),

      ...randomRelation,

      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return contacts;
};

// Modify generateClients to ensure each client has at least one contact and address
const generateClients = (
  num: number,
  users: any[],
  addresses: any[] = [],
  contacts: any[] = []
) => {
  const clients = [];
  const clientAddresses = [];
  const clientContacts = [];
  for (let i = 1; i <= num; i++) {
    const clientId = i;

    // Ensure each client has at least one contact and address
    const primaryAddress = {
      id: addresses.length + i, // Assuming addresses array is already initialized
      addressLine: faker.address.streetAddress(),
      city: pickRandom(cities),
      country: faker.address.country(),
      clientId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    clientAddresses.push(primaryAddress);

    const primaryContact = {
      id: contacts.length + i, // Assuming contacts array is already initialized
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      notes: faker.lorem.sentences(2),
      clientId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    clientContacts.push(primaryContact);

    clients.push({
      id: clientId,
      name: `${faker.company.name()} Engineering`,
      registrationNumber: faker.commerce.price({ min: 20, max: 400000 }),
      website: faker.internet.url(),
      notes: `Client specialized in ${pickRandom(engineeringFields)} projects.`,
      isActive: faker.datatype.boolean(),
      primaryAddressId: primaryAddress.id,
      primaryContactId: primaryContact.id,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return { clients, clientAddresses, clientContacts };
};

// Modify generateSuppliers to ensure each supplier has at least one contact and address
const generateSuppliers = (
  num: number,
  users: any[],
  addresses: any[] = [],
  contacts: any[] = []
) => {
  const suppliers = [];
  const supplierAddresses = [];
  const supplierContacts = [];
  for (let i = 1; i <= num; i++) {
    const supplierId = i;

    // Ensure each supplier has at least one contact and address
    const primaryAddress = {
      id: addresses.length + i, // Assuming addresses array is already initialized
      addressLine: faker.address.streetAddress(),
      city: pickRandom(cities),
      country: faker.address.country(),
      supplierId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    supplierAddresses.push(primaryAddress);

    const primaryContact = {
      id: contacts.length + i, // Assuming contacts array is already initialized
      name: faker.name.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      notes: faker.lorem.sentences(2),
      supplierId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    supplierContacts.push(primaryContact);

    suppliers.push({
      id: supplierId,
      name: `${faker.company.name()} Supply Co.`,
      field: pickRandom(suppliersFields),
      registrationNumber: faker.number.float(),
      website: faker.internet.url(),
      notes: `Supplier of ${pickRandom(engineeringFields)} equipment.`,
      isActive: faker.datatype.boolean(),
      primaryAddressId: primaryAddress.id,
      primaryContactId: primaryContact.id,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return { suppliers, supplierAddresses, supplierContacts };
};

// Generate projects with mechanical engineering contexts
const generateProjects = (num: number, users: any[], clients: any[]) => {
  const projects = [];
  for (let i = 1; i <= num; i++) {
    projects.push({
      id: i,
      name: `${pickRandom(engineeringFields)} Project ${i}`,
      status: pickRandom(statusCodes).value,
      description: `Project involving installation and maintenance of ${pickRandom(
        engineeringFields
      )} systems.`,
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      notes: faker.lorem.sentences(2),
      clientId: pickRandom(clients).id,
      ownerId: pickRandom(users).id,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return projects;
};

// Generate items (mechanical components)
const generateItems = (num: number, users: any[]) => {
  const items = [];
  for (let i = 1; i <= num; i++) {
    items.push({
      id: i,
      name: faker.commerce.productName(),
      type: pickRandom(engineeringFields),
      description: `${pickRandom(
        engineeringFields
      )} equipment, Model: ${faker.string.alphanumeric(8)}`,
      mpn: faker.string.alphanumeric(12), // Manufacturer part number
      make: pickRandom(suppliersFields),
      notes: `Manufactured by ${pickRandom(suppliersFields)}.`,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return items;
};

// Generate documents (contracts, specifications, orders)
const generateDocuments = (num: number) => {
  const documents = [];
  for (let i = 1; i <= num; i++) {
    documents.push({
      id: i,
      name: `Document ${i} - ${pickRandom([
        "Contract",
        "Specification",
        "Order",
      ])}`,
      path: faker.system.filePath(),
      extension: faker.system.commonFileExt(),
      notes: faker.lorem.sentences(2),
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
    });
  }
  return documents;
};

// Generate project items (linking items to projects)
const generateProjectItems = (
  num: number,
  projects: any[],
  items: any[],
  suppliers: any[]
) => {
  const projectItems = [];
  for (let i = 1; i <= num; i++) {
    projectItems.push({
      id: i,
      projectId: pickRandom(projects).id,
      itemId: pickRandom(items).id,
      supplierId: pickRandom(suppliers).id,
      quantity: faker.number.int({ min: 1, max: 100 }),
      price: faker.commerce.price({ min: 10, max: 1000000 }),
      notes: faker.lorem.sentence(),
    });
  }
  return projectItems;
};

// Generate document relations (linking documents to other entities)
const generateDocumentsRelations = (
  num: number,
  documents: any[],
  projects: any[],
  suppliers: any[],
  items: any[],
  clients: any[]
) => {
  const getRandomRelation = () =>
    pickRandom([
      { projectId: pickRandom(projects).id },
      { supplierId: pickRandom(suppliers).id },
      { itemId: pickRandom(items).id },
      { clientId: pickRandom(clients).id },
    ]);

  const documentsRelations = [];
  for (let i = 1; i <= num; i++) {
    const randomRelation = getRandomRelation();
    documentsRelations.push({
      id: i,
      documentId: pickRandom(documents).id,
      ...randomRelation,
    });
  }
  return documentsRelations;
};

// Generate mock data
const users = generateUsers(10);
const { clients, clientAddresses, clientContacts } = generateClients(20, users);
const { suppliers, supplierAddresses, supplierContacts } = generateSuppliers(
  30,
  users,
  clientAddresses,
  clientContacts
);
const otherContacts = generateContacts(
  20,
  users,
  suppliers,
  clients,
  [...clientContacts, ...supplierContacts].length
);
const otherAddresses = generateAddresses(
  10,
  users,
  suppliers,
  clients,
  [...clientAddresses, ...supplierAddresses].length
);
const projects = generateProjects(50, users, clients);
const items = generateItems(100, users);
const documents = generateDocuments(50);
const projectItems = generateProjectItems(100, projects, items, suppliers);
const documentsRelations = generateDocumentsRelations(
  50,
  documents,
  projects,
  suppliers,
  items,
  clients
);

// Write to JSON file
const mockData = {
  users,
  addresses: [...clientAddresses, ...supplierAddresses, ...otherAddresses],
  contacts: [...clientContacts, ...supplierContacts, ...otherContacts],
  clients,
  suppliers,
  projects,
  items,
  documents,
  projectItems,
  documentsRelations,
};

writeFileSync("mockData.json", JSON.stringify(mockData, null, 2));
console.log("Mock data generated successfully.");
