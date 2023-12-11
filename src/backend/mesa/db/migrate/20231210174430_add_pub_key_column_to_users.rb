class AddPubKeyColumnToUsers < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE "users" ADD COLUMN "pub_key" TEXT NULL;
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE "users" DROP COLUMN "pub_key";
    SQL
  end
end
