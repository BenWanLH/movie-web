import { graphql } from "./generated/index.ts";

export const PersonCardFields = graphql(`
  fragment PersonCardFields on Person {
    id name roles photoUrl
  }
`);

export const PeopleQuery = graphql(`
  query People($roles: [Role!], $name: String) {
     people(roles: $roles, name: $name) {
      ...PersonCardFields
    }
  }
`);

export const PersonQuery = graphql(`
  query Person($id: ID!) {
     person(id: $id) {
       id name roles birthDate bio photoUrl
    }
  }
`);

export const CreatePersonMutation = graphql(`
  mutation CreatePerson($personDetail: PersonDetail!) {
     createPerson(personDetail: $personDetail) {
       id
    }
  }
`);

export const UpdatePersonMutation = graphql(`
  mutation UpdatePerson($id: ID!, $personDetail: PersonDetail!) {
     updatePerson(id: $id, personDetail: $personDetail) {
       id
    }
  }
`);

export const DeletePersonMutation = graphql(`
  mutation DeletePerson($id: ID!) {
     deletePerson(id: $id)
  }
`);


