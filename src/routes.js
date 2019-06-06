const knex = require('./knex');
const bcrypt = require('bcrypt');

const routes = [
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return "Ooops. This resource isn't available."
    }
  },

  {
    method: 'POST',
    path: '/auth/register',
    handler: (request, h) => {
      const { username, password } = request.payload;
      const hashedPassword = bcrypt.hashSync(password.trim(), 10);

      if ( !username || !password || password.trim() === '' || username.trim() === '') {
        return "Your username and password are required."
      }

      return knex('users')
                  .where({ username })
                  .then((results) => {
                    if (results.length !== 0) {
                      return "That username is already taken."
                    }

                    return knex('users')
                                .insert({
                                  username: username.trim(),
                                  password: hashedPassword
                                })
                                .then((response) => {
                                  return "User created successfully."
                                }).catch((err) => {
                                  return "An error occurred. Please try again."
                                });
                  }).catch((err) => {
                    return "An error occurred. Please try again."
                  });
    }
  },

  {
    method: 'POST',
    path: '/auth/login',
    handler: (request, h) => {
      const { username, password } = request.payload;

      if ( !username || !password || password.trim() === '' || username.trim() === '') {
        return "Your username and password are required."
      }

      return knex('users')
                  .where({ username })
                  .then((results) => {
                    if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
                      return h.view("/auth")
                    }

                    request.cookieAuth.set({ id: results[0].userID });

                    return "Your credentials have been validated."
                  }).catch((err) => {
                    return "An error occurred. Please try again."
                  })
    }
  },

  {
    method: 'GET',
    path: '/auth',
    handler: (request, h) => {
      return "Please head on to /auth to login with your username and password."
    }
  },

  {
    method: 'GET',
    path: '/locations',
    handler: (request, h) => {

      return knex('locations')
                .select('locationID', 'location_name')
                .then((results) => {
                  if (results.length === 0) {
                    return "Locations list is currently empty."
                  }

                  return results;
                }).catch((err) => {
                  return "An error occurred. Please try again."
                });
    }
  },

  {
    method: 'GET',
    path: '/locations/statistics/{locationID}',
    handler: (request, h) => {
      return knex('locations')
                .where({ locationID:  request.params.locationID })
                .select('locationID', 'location_name')
                .then((results) => {
                  if (results.length === 0) {
                    return "That location ID does not exist. Please try again."
                  }

                  const location_name = results[0].location_name;

                  return knex('sublocations')
                              .where({ belongs_to: request.params.locationID })
                              .select('sublocation_name')
                              .then((results) => {
                                let sublocationStats = results.length;

                                return knex('residents')
                                            .where({ gender: 'female',  resident_of_location: request.params.locationID })
                                            .then((results) => {
                                              let femaleStats = results.length;

                                              return knex('residents')
                                                          .where({ gender: 'male', resident_of_location: request.params.locationID })
                                                          .then((results) => {
                                                            let maleStats = results.length;

                                                            return knex('locations')
                                                                      .where({ locationID: request.params.locationID })
                                                                      .select('location_name')
                                                                      .then((results) => {
                                                                        return `Location ${location_name} has ${sublocationStats} sublocation(s)`+
                                                                        ` and ${femaleStats + maleStats} residents, ${femaleStats} female `+
                                                                        `and ${maleStats} male.`
                                                                      })
                                                          })
                                            })
                              })

                  return results;
                }).catch((err) => {
                  return "An error occurred. Please try again."
                });
    }
  },

  {
    method: 'POST',
    path: '/locations',
    handler: (request, h) => {
      const { location_name } = request.payload;

      if (!location_name || location_name.trim() === '') {
        return "Please type in the location name to add a location successfully."
      }

      return knex('locations')
                 .where({ location_name })
                 .select('location_name')
                 .then((results) => {
                   if (results.length !== 0) {
                     return "A location by that name already exists."
                   }

                   return knex('locations')
                               .insert({
                                 location_name: location_name.trim()
                               })
                               .then((response) => {
                                 return "Location created successfully"
                               }).catch((err) => {
                                 return "An error occurred. Please try again."
                               });
                 }).catch((err) => {
                   return "An error occurred. Please try again."
                 });
    }
  },

  {
    method: 'PUT',
    path: '/locations/{locationID}',
    handler: (request, h) => {
      const { location_name } = request.payload;

      if (!location_name || location_name.trim() === '') {
        return "Please type in the location name for the update to be successful."
      }

      return knex('locations')
                .where({ locationID: request.params.locationID })
                .select('location_name')
                .then((results) => {
                  if (results.length === 0) {
                    return "There is no location by that location ID."
                  }

                  return knex('locations')
                            .where({ location_name })
                            .select('location_name')
                            .then((results) => {
                              if (results.length !== 0) {
                                return "A location by that name already exists."
                              }

                              return knex('locations')
                                          .where({ locationID: request.params.locationID })
                                          .update({ location_name: location_name.trim() })
                                          .then((response) => {
                                            return "Location updated successfully."
                                          }).catch((err) => {
                                            return "An error occurred. Please try again."
                                          });
                            }).catch((err) => {
                              return "An error occurred. Please try again."
                            })
                }).catch((err) => {
                  return "An error occurred. Please try again."
                });
    }
  },

  {
    method: 'DELETE',
    path: '/locations/{locationID}',
    handler: (request, h) => {
      return knex('locations')
                  .where({ locationID: request.params.locationID })
                  .del()
                  .then((results) => {
                    if (results === 0) {
                      return "There is no location by that ID. Please try again."
                    }

                    return "Location deleted successfully."
                  }).catch((err) => {
                    return  "An error occurred. Please try again."
                  });
    }
  },

  {
    method: 'GET',
    path: '/sublocations',
    handler: (request, h) => {
      return knex('sublocations')
                 .select('sublocation_name', 'sublocationID', 'belongs_to')
                 .then((results) => {
                   if (results.length === 0) {
                     return "There are no sublocations at the moment.";
                   }

                   return results;
                 }).catch((err) => {
                   return "An error occurred. Please try again."
                 });
    }
  },

  {
    method: 'POST',
    path: '/sublocations/{locationID}',
    handler: (request, h) => {
      const { sublocation_name } = request.payload;

      if (!sublocation_name || sublocation_name.trim() === '') {
        return "Please type in the sublocation name to add a sublocation successfully."
      }

      return knex('sublocations')
                 .where({ sublocation_name, belongs_to: request.params.locationID })
                 .select('sublocation_name')
                 .then((results) => {
                   if (results.length !== 0) {
                     return "A sublocation by that name already exists in that location."
                   }

                   return knex('sublocations')
                               .insert({
                                 sublocation_name: sublocation_name.trim(),
                                 belongs_to: request.params.locationID
                               })
                               .then((response) => {
                                 return "Sublocation created successfully"
                               }).catch((err) => {
                                 return "An error occurred. Please try again."
                               });
                 }).catch((err) => {
                   return "An error occurred. Please try again."
                 });

    }
  },

  {
    method: 'PUT',
    path: '/sublocations/{sublocationID}',
    handler: (request, h) => {
      const { sublocation_name } = request.payload;

      if (!sublocation_name || sublocation_name.trim() === '') {
        return "Please type in the sublocation name for the update to be successful."
      }

      return knex('sublocations')
                .where({ sublocationID: request.params.sublocationID })
                .select('sublocation_name')
                .then((results) => {
                  if (results.length === 0) {
                    return "There is no sublocation by that ID."
                  }

                  return knex('sublocations')
                            .where({ sublocation_name })
                            .select('sublocation_name')
                            .then((results) => {
                              if (results.length !== 0) {
                                return "A sublocation by that name already exists."
                              }

                              return knex('sublocations')
                                          .where({ sublocationID: request.params.sublocationID })
                                          .update({ sublocation_name: sublocation_name.trim() })
                                          .then((response) => {
                                            return "Sublocation updated successfully."
                                          }).catch((err) => {
                                            return "An error occurred. Please try again."
                                          });
                            }).catch((err) => {
                              return "An error occurred. Please try again."
                            })
                }).catch((err) => {
                  return "An error occurred. Please try again."
                });
    }
  },

  {
    method: 'DELETE',
    path: '/sublocations/{sublocationID}',
    handler: (request, h) => {
      return knex('sublocations')
                  .where({ sublocationID: request.params.sublocationID })
                  .del()
                  .then((results) => {
                    if (results === 0) {
                      return "There is no sublocation by that ID. Please try again."
                    }

                    return "Sublocation deleted successfully."
                  }).catch((err) => {
                    return  "An error occurred. Please try again."
                  });
    }
  },

  {
    method: 'GET',
    path: '/residents',
    handler: (request, h) => {
      return knex('residents')
                 .select('residentID', 'resident_name', 'age', 'gender', 'resident_of_location')
                 .then((results) => {
                   if (results.length === 0) {
                     return "The residents list is empty at the moment."
                   }

                   return results;
                 }).catch((err) => {
                   return  "An error occurred. Please try again.";
                 });
    }
  },

  {
    method: 'GET',
    path: '/residents/{gender}',
    handler: (request, h) => {
      return knex('residents')
                .where({ gender: request.params.gender })
                .select('residentID', 'resident_name', 'age', 'gender', 'resident_of_location', 'resident_of_sublocation')
                .then((results) => {
                  if (results.length === 0) {
                    return `The ${request.params.gender} residents list is either empty or does not exist.`
                  }

                  return results;
                }).catch((err) => {
                  return  "An error occurred. Please try again.";
                });
    }
  },

  {
    method: 'POST',
    path: '/residents/{locationID}',
    handler: (request, h) => {
      const { resident_name, age, gender } = request.payload;

      if (!resident_name ||  !age || resident_name.trim() === '' ||  gender.trim() === '') {
        return "Please type in the residents name, gender and age."
      }

      return knex('residents')
                 .where({ resident_name })
                 .select('resident_name')
                 .then((results) => {
                   if (results.length !== 0) {
                     return "A resident by that name already exists."
                   }

                   return knex('residents')
                               .insert({
                                 resident_name: resident_name.trim(),
                                 gender: gender.trim(),
                                 resident_of_location: request.params.locationID,
                                 age
                               })
                               .then((response) => {
                                 return "Resident added successfully"
                               }).catch((err) => {
                                 return "An error occurred. Please try again."
                               });
                 }).catch((err) => {
                   return "An error occurred. Please try again."
                 });
    }
  },

  {
    method: 'PUT',
    path: '/residents/{residentID}',
    handler: (request, h) => {
      const { resident_name, age, gender } = request.payload;

      return knex('residents')
                .where({ residentID: request.params.residentID })
                .select('residentID')
                .then((results) => {
                  if (results.length === 0) {
                    return "There is no resident by that ID."
                  }

                  return knex('residents')
                            .then((results) => {
                              if (resident_name) {
                                return knex('residents')
                                            .where({ residentID: request.params.residentID })
                                            .update({ resident_name: resident_name.trim() })
                                            .then((response) => {
                                              if (gender) {
                                                return knex('residents')
                                                            .where({ residentID: request.params.residentID })
                                                            .update({ gender: gender.trim()})
                                                            .then((response) => {
                                                              if (age) {
                                                                return knex('residents')
                                                                            .where({ residentID: request.params.residentID })
                                                                            .update({ age: age.trim()})
                                                                            .then((response) => {
                                                                              return "Residents name, gender and age updated successfully."
                                                                            }).catch((err) => {
                                                                              return "An error occurred. Please try again."
                                                                            });
                                                              }

                                                              return "Residents name and gender updated successfully."
                                                            }).catch((err) => {
                                                              return "An error occurred. Please try again."
                                                            });
                                              }

                                              return "Residents name updated successfully."
                                            }).catch((err) => {
                                              return "An error occurred. Please try again."
                                            });
                              }

                              return "You have to provide a residents name."
                            }).catch((err) => {
                              return "An error occurred. Please try again."
                            });
                }).catch((err) => {
                  return "An error occurred. Please try again."
                });
    }
  },

  {
    method: 'DELETE',
    path: '/residents/{residentID}',
    handler: (request, h) => {
      return knex('residents')
                  .where({ residentID: request.params.residentID })
                  .del()
                  .then((results) => {
                    if (results === 0) {
                      return "There is no resident by that ID. Please try again."
                    }

                    return "Resident deleted successfully."
                  }).catch((err) => {
                    return  "An error occurred. Please try again."
                  });
    }
  }
]

module.exports =  routes;
