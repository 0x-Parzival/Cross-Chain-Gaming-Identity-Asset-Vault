#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod gamer_profile {
    #[ink(storage)]
    pub struct GamerProfileContract {
        profiles: ink::storage::Mapping<AccountId, Profile>,
    }

    #[derive(scale::Encode, scale::Decode, Clone, Debug, Default, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct Profile {
        handle: ink::prelude::string::String,
        level: u8,
    }

    impl GamerProfileContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                profiles: Default::default(),
            }
        }

        #[ink(message)]
        pub fn create_profile(&mut self, handle: String) {
            let caller = self.env().caller();
            let profile = Profile {
                handle,
                level: 1,
            };
            self.profiles.insert(&caller, &profile);
        }

        #[ink(message)]
        pub fn get_profile(&self, user: AccountId) -> Option<Profile> {
            self.profiles.get(&user)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[ink::test]
    fn create_profile_works() {
        let mut contract = GamerProfileContract::new();
        contract.create_profile("GamerX".to_string());
        let caller = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>()
            .expect("Cannot get accounts")
            .alice;
        let profile = contract.get_profile(caller);
        assert_eq!(
            profile,
            Some(Profile {
                handle: "GamerX".to_string(),
                level: 1,
            })
        );
    }
}
