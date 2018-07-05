# Safety Check

This is an Outlook add-on that compares hyperlinks (or text) in an e-mail with known phish.  

## Usage

The application presents itself as an icon in the Outlook desktop, mobile, and web apps.  Simply click the icon and
it will do its thing.  If the e-mail is a known phish, it will tell you.  Otherwise, it will tell you otherwise.

## Back end

The back end consists of a .Net handler file that queries a MySQL table.  The table contains records from phishtank.org as well as those you add yourself.
