use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;
pub use state::*;
declare_id!("8NvteZcroHN4inQuuHjNjch3SrPhBuKEa558sz8k8jUv");

#[program]
pub mod account_data {
    use instructions::initialize;

    use super::*;

    pub fn create_address_info(ctx: Context<CreateAddressInfo>, name: String, house_number: u8, street: String, city: String) -> Result<()> {
        initialize::create_address_info(ctx, name, house_number, street, city)
    }
}
