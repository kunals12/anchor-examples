use anchor_lang::prelude::*;

use crate::AddressInfo;

#[derive(Accounts)]
pub struct CreateAddressInfo<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init, 
        space=8+AddressInfo::INIT_SPACE, 
        payer=owner,
    )]
    pub address_info: Account<'info, AddressInfo>,
    pub system_program: Program<'info, System>
}

pub fn create_address_info(ctx: Context<CreateAddressInfo>, name: String, house_number: u8, street: String, city: String) -> Result<()> {
    msg!("Greetings from: {:?}", ctx.program_id);
    *ctx.accounts.address_info = AddressInfo {
        name,house_number,street,city
    };
    Ok(())
}
