// Sample data for initial setup
export const sampleDivisions = [
  { _id: '1', name: 'Paithan' },
  { _id: '2', name: 'Sillod' },
  { _id: '3', name: 'Kannad' },
  { _id: '4', name: 'Gangapur' },
  { _id: '5', name: 'CNS Rural' },
  { _id: '5', name: 'Vaijapur' },
];

export const sampleVillages = [
  { _id: '1', name: 'Kannad', divisionId: '1' },
  { _id: '2', name: 'Khultabad', divisionId: '1' },
  { _id: '3', name: 'Gangapur', divisionId: '2' },
  { _id: '4', name: 'Paithan', divisionId: '2' },
  { _id: '5', name: 'Karamad', divisionId: '3' },
  { _id: '6', name: 'Phulambari', divisionId: '4' },
];

export const sampleCrimeTypes = [
  { _id: '1', name: 'Dacoity' },
  { _id: '2', name: 'Robbery' },
  { _id: '3', name: 'Theft' },
  { _id: '4', name: 'House Break' },
  { _id: '5', name: 'Vehical Theft' },
  { _id: '6', name: 'Animal Theft' },
];

export const sampleSubCrimeTypes = [
  { _id: '1', name: 'Day', crimeTypeId: '4' },
  { _id: '2', name: 'Night', crimeTypeId: '4' },
  { _id: '3', name: 'Chain Snatching', crimeTypeId: '2' },
  { _id: '4', name: 'Two Wheeler', crimeTypeId: '5' },
  { _id: '5', name: 'Four Wheeler', crimeTypeId: '5' },
  { _id: '6', name: 'Mobile Snatching', crimeTypeId: '2' },
  // { _id: '7', name: 'Data Theft', crimeTypeId: '3' },
  // { _id: '8', name: 'Land Dispute', crimeTypeId: '4' },
];

// Sample cases data
export const sampleCases = Array.from({ length: 50 }, (_, index) => ({
  _id: `case${index + 1}`,
  division: sampleDivisions[Math.floor(Math.random() * sampleDivisions.length)]._id,
  village: sampleVillages[Math.floor(Math.random() * sampleVillages.length)]._id,
  crimeType: sampleCrimeTypes[Math.floor(Math.random() * sampleCrimeTypes.length)]._id,
  subType: sampleSubCrimeTypes[Math.floor(Math.random() * sampleSubCrimeTypes.length)]._id,
  name: `Complainant ${index + 1}`,
  section: `IPC ${100 + index}`,
  description: `Sample case description ${index + 1}`,
  date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
  photo: `https://picsum.photos/200/200?random=${index}`,
  address: `Address ${index + 1}, Street ${Math.floor(Math.random() * 100)}, City`
}));

// Sample users data
export const sampleUsers = Array.from({ length: 20 }, (_, index) => ({
  _id: `user${index + 1}`,
  firstName: `First${index + 1}`,
  lastName: `Last${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  policeStation: sampleVillages[Math.floor(Math.random() * sampleVillages.length)]._id,
  role: index < 5 ? 'admin' : 'police',
  photo: `https://picsum.photos/200/200?random=${index + 100}`
}));