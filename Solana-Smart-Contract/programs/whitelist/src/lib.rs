use anchor_lang::prelude::*;

declare_id!("FFo2xyP5Dd1BT5mFLZKvMoohzx2pdMBg9mgvyFb6WXRV");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const UNSIGNED64_LENGTH: usize = 8;

#[program]
pub mod whitelist {
    use super::*;

    pub fn new_whitelist(ctx: Context<NewWhitelist>) -> Result<()> {
        let whitelist = &mut ctx.accounts.whitelist;
        whitelist.authority = ctx.accounts.admin.key();
        Ok(())
    }
    pub fn add_address(_ctx: Context<AddAddress>, _wallet: Pubkey) -> Result<()> {
        Ok(())
    }
    pub fn remove_address(_ctx: Context<RemoveAddress>, _wallet: Pubkey) -> Result<()> {
        Ok(())
    }
    pub fn check_address(_ctx: Context<CheckAddress>, _wallet: Pubkey) -> Result<()> {
        Ok(())
    }
   
    
}

#[derive(Accounts)]
pub struct NewWhitelist<'info> {
    #[account(init,
        payer=admin,
        space=Whitelist::LEN,
    )]
    whitelist: Account<'info, Whitelist>,

    #[account(mut)]
    admin: Signer<'info>,
    system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(wallet: Pubkey)]
pub struct AddAddress<'info> {
    #[account(mut, has_one = authority)]
    whitelist: Account<'info, Whitelist>,
    #[account(init,
        payer = authority,
        space = DISCRIMINATOR_LENGTH,
        seeds = [
            whitelist.key().as_ref(), 
            wallet.as_ref()
            ],
        bump,
    )]
    pda_id: Account<'info, Wallet>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wallet: Pubkey)]
pub struct RemoveAddress<'info> {
    #[account(mut, has_one = authority)]
    whitelist: Account<'info, Whitelist>,
    #[account(
        mut,
        seeds=[whitelist.key().as_ref(), wallet.as_ref()],
        bump,
        close = authority,
    )]
    pda_id: Account<'info, Wallet>,
    #[account(mut)]
    authority: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(wallet: Pubkey)]
pub struct CheckAddress<'info> {
    whitelist: Account<'info, Whitelist>,
    #[account(
        seeds = [
            whitelist.key().as_ref(), 
            wallet.key().as_ref()
            ],
        bump,
    )]
    pda_id: Account<'info, Wallet>,
}

#[account]
pub struct Whitelist {
    pub authority: Pubkey,
}

impl Whitelist {
    const LEN: usize = DISCRIMINATOR_LENGTH + PUBKEY_LENGTH + UNSIGNED64_LENGTH;
}

#[account]
pub struct Wallet {}
