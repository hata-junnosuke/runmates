# AmazingPrintの設定
begin
  require 'amazing_print'
  AmazingPrint.pry!
rescue LoadError
  puts "gem 'amazing_print' is not available"
end