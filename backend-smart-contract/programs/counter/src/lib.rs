use anchor_lang::prelude::*;
use whitelist::cpi::accounts::{
    AddAddress, CheckAddress, NewWhitelist, RemoveAddress,
};
use crate::whitelist::Wallet;
use whitelist::program::Whitelist;
use whitelist::{self};
declare_id!("BAkJm4eDSRr6Rn1xeu8kxXnuD46B1iNTz2fPF9NK8sDh");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const UNSIGNED64_LENGTH: usize = 8;

#[program]
pub mod counter {
    use super::*;

    pub fn init_counter(ctx: Context<InitCounter>, bump:u8) -> Result<()> {

        msg!("Initializing counter account...");
        
        let counter = &mut ctx.accounts.counter;
        counter.authority = ctx.accounts.authority.key();
        counter.count = 0;
        counter.bump = bump;
        counter.program = Pubkey::default();
        counter.initialized = false;

        msg!("Authority set to ...{}",ctx.accounts.authority.key());

        Ok(())
    }
    pub fn point_to_whitelist(ctx: Context<PointWhitelist>) -> Result<()> {

        let counter = &mut ctx.accounts.counter;
        assert!(counter.initialized == false);
        
        counter.program = ctx.accounts.whitelisting.key();
        counter.initialized = true;

        msg!("Pointing Counter to a New Whitelist...{}");

            let pointer_ctx = ctx.accounts.whitelist_ctx();
            let _ = whitelist::cpi::new_whitelist(pointer_ctx);
      

        Ok(())
    }


    pub fn add_or_remove(ctx: Context<AddOrRemove>, wallet: Pubkey, remove:bool) -> Result<()> {

        let counter = &mut ctx.accounts.counter;
        assert!(counter.initialized ==true);

        let admin = ctx.accounts.authority.key();
        let count = counter.count;
        let seeds= ["counter".as_bytes().as_ref(), admin.as_ref(), &[counter.bump]];
        let signer = &[&seeds[..]];
        
        match remove{ 

            true => {

                msg!("Removing process started...");

                    msg!("Checking that the address actually exist in the whitelist");

                    let check_ctx = ctx.accounts.check_ctx().with_signer(signer);
                    match whitelist::cpi::check_address(check_ctx, wallet.key()){

                        Ok(()) =>{
                                    let remove_ctx = ctx.accounts.remove_wallet_ctx().with_signer(signer);
                                    let _ = whitelist::cpi::remove_address(remove_ctx, wallet);

                                    msg!("-1 to the counter...");

                                        ctx.accounts.counter.count = count.checked_sub(1).unwrap();

                                     Ok(())
                                 }

                        Err(e) => Err(e),
                                    
                    }
                    },

            false => {

                    msg!("Adding process started...");

                        let add_ctx = ctx.accounts.adding_new_wallet_ctx().with_signer(signer);
                        let _ = whitelist::cpi::add_address(add_ctx, wallet);

                    msg!("+1 to the counter...");

                        ctx.accounts.counter.count = count.checked_add(1).unwrap();

                    Ok(())
                    } 
                  
                    
       
        }
    }
}

// Data validators

#[derive(Accounts)]
pub struct InitCounter<'info> {
    
    #[account(
        init,
        seeds =[
                "counter".as_bytes().as_ref(), 
                authority.key().as_ref()
                ],
        bump, 
        payer=authority, 
        space=Counter::LEN)
    ]
    counter: Account<'info, Counter>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct PointWhitelist<'info> {
    
    #[account(
        mut,
        seeds = [
                "counter".as_bytes().as_ref(), 
                authority.key().as_ref()
                ],
        bump, 
        has_one = authority,
    )]
    counter: Account<'info, Counter>,
    pointer_to_whitelist_id: Program<'info, Whitelist>,
    #[account(mut, signer)]
    ///CHECK : Error checkpoint: if not they say that is not initialised
    whitelisting: AccountInfo<'info>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddOrRemove<'info> {

    #[account(
        mut,
        seeds = [
                "counter".as_bytes().as_ref(),
                authority.key().as_ref()
                ],
                has_one = authority,
        bump,
        )]
    counter: Account<'info, Counter>,
    #[account(mut)]
    ///CHECK
    pda_id: AccountInfo<'info>,
    #[account(mut)]
    ///CHECK
    whitelisting: AccountInfo<'info>,
    update_id: Program<'info, Whitelist>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}
#[derive(Accounts)]

pub struct UpdateCounter<'info> {
    
    #[account(
        mut,
        seeds = [
                "counter".as_bytes().as_ref(),
                authority.key().as_ref()
                ],
                bump,
    )]
    counter: Account<'info, Counter>,
    pda_id: Account<'info, Wallet>,
    wallet_address: Signer<'info>,
    /// CHECK
    whitelisting: AccountInfo<'info>,
    update_id: Program<'info, Whitelist>,
    /// CHECK
    authority: AccountInfo<'info>,
    system_program: Program<'info, System>,
}
// Data Structures
#[account]
pub struct Counter {
    authority: Pubkey,
    count: u64,
    bump:u8,
    program:Pubkey,
    initialized:bool,
}

// Implementations of Context
impl<'info> PointWhitelist<'info> {
    pub fn whitelist_ctx(&self,) -> CpiContext<'_, '_, '_, 'info, NewWhitelist<'info>> {

        let pointer_to_whitelist_id = self.pointer_to_whitelist_id.to_account_info();

        let init_account = NewWhitelist{
                                        admin: self.authority.to_account_info(),
                                        whitelist: self.whitelisting.to_account_info(),
                                        system_program: self.system_program.to_account_info(),
                                        };

        CpiContext::new(pointer_to_whitelist_id, init_account)
    }
}

impl<'info> AddOrRemove<'info> {
    pub fn remove_wallet_ctx(&self,) -> CpiContext<'_, '_, '_, 'info, RemoveAddress<'info>> {

        let update_id = self.update_id.to_account_info();

        let update_account = RemoveAddress{
                                            authority: self.authority.to_account_info(),
                                            whitelist: self.whitelisting.to_account_info(),
                                            pda_id:self.pda_id.to_account_info(),
                                            system_program: self.system_program.to_account_info(),
                                            };

        CpiContext::new(update_id, update_account)
    }
    pub fn adding_new_wallet_ctx(&self,) -> CpiContext<'_, '_, '_, 'info, AddAddress<'info>> {

        let update_id = self.update_id.to_account_info();

        let update_account = AddAddress{
                                        authority: self.authority.to_account_info(),
                                        whitelist: self.whitelisting.to_account_info(),
                                        pda_id:self.pda_id.to_account_info(),
                                        system_program: self.system_program.to_account_info(),
                                        };

        CpiContext::new(update_id, update_account)
    }
    pub fn check_ctx(&self,) -> CpiContext<'_, '_, '_, 'info, CheckAddress<'info>> {

        let update_id = self.update_id.to_account_info();

        let update_account = CheckAddress{
                                            whitelist: self.whitelisting.to_account_info(),
                                            pda_id:self.pda_id.to_account_info(),
                                        };

        CpiContext::new(update_id, update_account)
    }
}

impl Counter {
    const LEN: usize = (DISCRIMINATOR_LENGTH*2 + PUBKEY_LENGTH *2 + UNSIGNED64_LENGTH *2);
}
