import { config } from "dotenv";
import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";

const configResult = config();

// @ts-ignore
const { USER_PASSWORD } = configResult.parsed;

import {
  AddressTableType,
  ClientTableType,
  ContactTableType,
  DocumentRelationTableType,
  DocumentTableType,
  ItemTableType,
  ProjectItemTableType,
  ProjectTableType,
  SupplierTableType,
  UserTableType,
} from "./schema-types.ts";

// Start IDs for each table
const usersStartId = 1;
const clientsStartId = 2;
const suppliersStartId = 2;
const addressesStartId = 4;
const contactsStartId = 3;
const projectsStartId = 1;
const itemsStartId = 3;
const documentsStartId = 10;
const projectItemsStartId = 3;
const documentsRelationsStartId = 9;

const numberOfUsers = 10;
const numberOfClients = 40;
const numberOfSuppliers = 50;
const numberOfAddresses = 10;
const numberOfContacts = 30;
const numberOfProjects = 70;
const numberOfDocuments = 120;

const maxNumberOfItemsPerProject = 10;
const numberOfItems = 100;

const numberOfDocumentsRelations = 200;

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
const cities = ["Cairo", "Alexandria", "Al Sharqiyah", "Aswan", "Matruh"];

// Format XXX-XXX-XXX-XXXX
const generateRandomRegistrationNumber = () =>
  Math.floor(100 + Math.random() * 900) +
  "-" +
  Math.floor(100 + Math.random() * 900) +
  "-" +
  Math.floor(100 + Math.random() * 900) +
  "-" +
  Math.floor(1000 + Math.random() * 9000);

const statusCodes = [
  { value: 0, label: "Active" },
  { value: 1, label: "Inactive" },
  { value: 2, label: "Archived" },
  { value: 3, label: "Pending" },
  { value: 4, label: "Rejected" },
  { value: 5, label: "Cancelled" },
  { value: 6, label: "Completed" },
  { value: 7, label: "On Hold" },
  { value: 8, label: "Pending Approval" },
  { value: 9, label: "Pending Payment" },
  { value: 10, label: "Pending Delivery" },
  { value: 11, label: "Issue" },
];

const currencyOptions = [
  { value: 0, label: "USD" },
  { value: 1, label: "EUR" },
  { value: 2, label: "GBP" },
  { value: 3, label: "JPY" },
  { value: 4, label: "INR" },
  { value: 5, label: "CNY" },
  { value: 7, label: "AED" },
  { value: 8, label: "SAR" },
  { value: 9, label: "EGP" },
];

const addressTypes = ["Main Office", "Headquarters", "Office", "Branch"];

// Helper to pick a random item from an array
const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Generate users with domain-specific roles
const generateUsers = (num: number, startId: number = 0): UserTableType[] => {
  const users = [];
  for (let i = 1; i <= num; i++) {
    users.push({
      id: startId + i,
      name: faker.person.firstName() + " " + faker.person.lastName(),
      username: faker.internet.userName(),
      role: i % 5 === 0 ? "admin" : "user",
      active: true,
      password: USER_PASSWORD,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      lastActive: faker.date.recent(),
    });
  }
  return users;
};

// Generate addresses
const generateAddresses = (
  num: number,
  users: UserTableType[],
  suppliers: SupplierTableType[],
  clients: ClientTableType[],
  startId: number = 0
): AddressTableType[] => {
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
      name: pickRandom(addressTypes),
      addressLine: faker.location.streetAddress(),
      city: pickRandom(cities),
      country: "Egypt",
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
  users: UserTableType[],
  suppliers: SupplierTableType[],
  clients: ClientTableType[],
  startId: number = 0
): ContactTableType[] => {
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
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
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

const generateClients = (
  num: number,
  users: UserTableType[],
  addressesStartId: number = 0,
  contactsStartId: number = 0,
  clientsStartId: number = 0
): {
  clients: ClientTableType[];
  clientAddresses: AddressTableType[];
  clientContacts: ContactTableType[];
} => {
  const clients = [];
  const clientAddresses = [];
  const clientContacts = [];
  for (let i = 1; i <= num; i++) {
    const clientId = clientsStartId + i;

    const primaryAddress = {
      id: addressesStartId + i,
      name: pickRandom(addressTypes),
      addressLine: faker.location.streetAddress(),
      city: pickRandom(cities),
      country: "Egypt",
      clientId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    clientAddresses.push(primaryAddress);

    const primaryContact = {
      id: contactsStartId + i,
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
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
      registrationNumber: generateRandomRegistrationNumber(),
      website: faker.internet.url(),
      notes: `Client specialized in ${pickRandom(engineeringFields)} projects.`,
      isActive: true,
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

const generateSuppliers = (
  num: number,
  users: UserTableType[],
  addressesStartId: number = 0,
  contactsStartId: number = 0,
  suppliersStartId: number = 0
): {
  suppliers: SupplierTableType[];
  supplierAddresses: AddressTableType[];
  supplierContacts: ContactTableType[];
} => {
  const suppliers = [];
  const supplierAddresses = [];
  const supplierContacts = [];
  for (let i = 1; i <= num; i++) {
    const supplierId = suppliersStartId + i;

    const primaryAddress = {
      id: addressesStartId + i,
      name: pickRandom(addressTypes),
      addressLine: faker.location.streetAddress(),
      city: pickRandom(cities),
      country: "Egypt",
      supplierId,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    };
    supplierAddresses.push(primaryAddress);

    const primaryContact = {
      id: contactsStartId + i,
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
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
      registrationNumber: generateRandomRegistrationNumber(),
      website: faker.internet.url(),
      notes: `Supplier of ${pickRandom(engineeringFields)} equipment.`,
      isActive: true,
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      updatedBy: pickRandom(users).id,
    });
  }
  return { suppliers, supplierAddresses, supplierContacts };
};

// Generate projects with mechanical engineering contexts
const generateProjects = (
  num: number,
  users: UserTableType[],
  clients: ClientTableType[],
  startId: number = 0
): ProjectTableType[] => {
  const projects = [];
  for (let i = 1; i <= num; i++) {
    projects.push({
      id: startId + i,
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
const generateItems = (
  num: number,
  users: UserTableType[],
  startId: number = 0
): ItemTableType[] => {
  const items = [];
  for (let i = 1; i <= num; i++) {
    items.push({
      id: startId + i,
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
const generateDocuments = (
  num: number,
  startId: number = 0
): DocumentTableType[] => {
  const documents = [];
  for (let i = 1; i <= num; i++) {
    documents.push({
      id: startId + i,
      name: `Document ${startId + i} - ${pickRandom([
        "Contract",
        "Specification",
        "Order",
      ])}`,
      path: ".local-storage/documents/56_way_sealed_connector_system_ecu (1).pdf",
      extension: "pdf",
      notes: faker.lorem.sentences(2),
      createdBy: pickRandom(users).id,
      createdAt: faker.date.past(),
    });
  }
  return documents;
};

// Generate project items (linking items to projects)
const generateProjectItems = (
  maxNum: number,
  projects: ProjectTableType[],
  items: ItemTableType[],
  suppliers: SupplierTableType[],
  startId: number = 0
): ProjectItemTableType[] => {
  const projectItems = [];
  let x = startId;
  for (const project of projects) {
    const num = Math.floor(Math.random() * maxNum);
    for (let i = 1; i <= num; i++) {
      projectItems.push({
        id: x + i,
        projectId: project.id,
        itemId: pickRandom(items).id,
        supplierId: pickRandom(suppliers).id,
        quantity: faker.number.int({ min: 1, max: 100 }),
        price: faker.commerce.price({ min: 10, max: 10000 }),
        currency: currencyOptions.find((o) => o.label === "EGP")?.value ?? 9,
      });
    }
    x += num;
  }
  return projectItems;
};

// Generate document relations (linking documents to other entities)
const generateDocumentsRelations = (
  num: number,
  documents: DocumentTableType[],
  projects: ProjectTableType[],
  suppliers: SupplierTableType[],
  items: ItemTableType[],
  clients: ClientTableType[],
  startId: number = 0
): DocumentRelationTableType[] => {
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
      id: startId + i,
      documentId: pickRandom(documents).id,
      ...randomRelation,
    });
  }
  return documentsRelations;
};

// Generate mock data
const users = generateUsers(numberOfUsers, usersStartId);
const { clients, clientAddresses, clientContacts } = generateClients(
  numberOfClients,
  users,
  addressesStartId,
  contactsStartId,
  clientsStartId
);
const { suppliers, supplierAddresses, supplierContacts } = generateSuppliers(
  numberOfSuppliers,
  users,
  addressesStartId + clientAddresses.length,
  contactsStartId + clientContacts.length,
  suppliersStartId
);
const otherContacts = generateContacts(
  numberOfContacts,
  users,
  suppliers,
  clients,
  contactsStartId + [...clientContacts, ...supplierContacts].length
);
const otherAddresses = generateAddresses(
  numberOfAddresses,
  users,
  suppliers,
  clients,
  addressesStartId + [...clientAddresses, ...supplierAddresses].length
);
const projects = generateProjects(
  numberOfProjects,
  users,
  clients,
  projectsStartId
);
const items = generateItems(numberOfItems, users, itemsStartId);
const documents = generateDocuments(numberOfDocuments, documentsStartId);
const projectItems = generateProjectItems(
  maxNumberOfItemsPerProject,
  projects,
  items,
  suppliers,
  projectItemsStartId
);
const documentsRelations = generateDocumentsRelations(
  numberOfDocumentsRelations,
  documents,
  projects,
  suppliers,
  items,
  clients,
  documentsRelationsStartId
);

// Write to JSON file
const mockData = {
  users,
  addresses: [...clientAddresses, ...supplierAddresses, ...otherAddresses].sort(
    (a, b) => a.id - b.id
  ),
  contacts: [...clientContacts, ...supplierContacts, ...otherContacts].sort(
    (a, b) => a.id - b.id
  ),
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
